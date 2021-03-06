# -*- coding: utf-8 -*-

from flask import request, render_template, redirect, send_from_directory

from tasklist import app, models
from tasklist.utils import to_json, render_json, generate_uuid, cache
from tasklist.validators import TaskListValidator, TaskValidator
from tasklist.exceptions import TaskNotFoundException, TaskListNotFoundException, TaskListAlreadyExistsException
from tasklist.decorators import token_required, tasklist_required

import os

@app.route("/")
def index():
	"""
	Initial page
	"""
	return render_template("index.html")

@app.route('/favicon.ico')
def favicon():
	"""
	Serves favicon.ico on root
	"""
	return send_from_directory(os.path.join(app.root_path, 'static'), 'img/favicon.ico')


@app.route("/<path:path>")
def path(path):
	"""
	Redirect to index putting a '#' in front of the path (Backbone that handle views)
	"""
	return redirect("/#/%s" % path)

@app.teardown_request
def shutdown_session(exception=None):
	from database import db_session
	db_session.remove()


#########
# 'API' #
#########

@app.route("/api/get_token", methods=['POST'])
def authorize():
	"""
	POST /api/get_token - Authorize a client to use the api by giving a temporary token to access the API

	PARAMETERS:
		tasklist_id - Id of tasklist
		password - Password to retrieve token
	"""
	try:
		if models.authorize_user(request.json['tasklist_id'], request.json['password']):
			token = generate_uuid(request.json['tasklist_id']);
			cache.set('key' + request.json['tasklist_id'], token)
			
			json_str = '{"tasklist_id": "%s", "token": "%s"}' % (request.json['tasklist_id'], token)
			return render_json(json_str)
		else:
			return render_json('{"error": "Invalid credentials"}'), 401
	except TaskListNotFoundException, e:
		return render_json('{"error": "%s"}' % e.message), 404
		

@app.route("/api/tasklists", methods=['POST'])
def create_tasklist():
	"""
	POST /api/tasklists - Create a TaskList

	PARAMETERS:
		model
			tasklist_id - Id of tasklist
			password - Password to retrieve token
	"""
	task = request.json['model']
	try:
		if TaskListValidator.valid(task):
			tasklist = models.create_tasklist(task['tasklist_id'], task['password'])
			return render_json(to_json(tasklist))
		else:
			return render_json('{"error": "Invalid tasklist parameters"}'), 400
	except TaskListAlreadyExistsException, e:
		return render_json('{"error": "%s"}' % e.message), 409

@app.route("/api/<tasklist_id>/tasks")
@tasklist_required
@token_required
def get_tasks(tasklist_id):
	"""
	GET /<tasklist_id>/tasks - Get all tasks that belogs to a tasklist

	PARAMETERS:
		tasklist_id - Id of tasklist
		token - Token given for authorization
	"""
	return render_json(to_json(models.get_tasks(tasklist_id)))


@app.route("/api/<tasklist_id>/tasks", methods=['POST'])
@tasklist_required
@token_required
def create_task(tasklist_id):
	"""
	POST /<tasklist_id>/tasks - Create a task associating it to a tasklist

	PARAMETERS:
		tasklist_id - Id of existent TaskList
		model
			title - Title of the task
			completed - Status of the task
	"""
	task = request.json['model']
	if TaskValidator.valid(task):
		task = models.create_task(tasklist_id, task['title'], task['completed'])
		return render_json(to_json(task))
	else:
		return render_json('{"error": "Invalid task parameters"}'), 400


@app.route("/api/<tasklist_id>/tasks/<task_id>", methods=['PUT'])
@tasklist_required
@token_required
def update_task(tasklist_id, task_id):
	"""
	PUT /<tasklist_id>/tasks/<task_id> - Modify the status of a Task that belongs to a TaskList.

	PARAMETERS:
		tasklist_id - Id of tasklist
		task_id - Id of the task
		model
			title - Title of the task
			completed - Status of the task
	"""
	try:
		task = request.json['model']
		if TaskValidator.valid(task):
			task = models.update_task(task_id, task['title'], task['completed'])
			return render_json(to_json(task))
		else:
			return render_json('{"error": "Invalid parameters"}'), 400
	except TaskNotFoundException as e:
		return render_json('{"error": %s }', e.message), 404


@app.route("/api/<tasklist_id>/tasks/<id>", methods=['DELETE'])
@tasklist_required
@token_required
def delete_task(tasklist_id, id):
	"""
	DELETE /<tasklist_id>/tasks/<task_id> - Remove a Task from a TaskList.

	PARAMETERS:
		tasklist_id - Id of the tasklist
		task_id - Id of the task
	"""
	try:
		models.remove_task(id)
		return render_json('{"okay": "deleted"}')
	except TaskNotFoundException as e:
		return render_json('{"error": %s }', e.message), 404