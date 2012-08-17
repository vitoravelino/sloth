# -*- coding: utf-8 -*-

from sqlalchemy.exc import IntegrityError

from tasklist.database import db_session
from tasklist.entities import Task, TaskList
from tasklist.exceptions import TaskListNotFoundException, TaskListAlreadyExistsException

# tasklist

def authorize_user(tasklist_id, password):
	tasklist = get_tasklist(tasklist_id)
	if (tasklist):
		return tasklist.password == password
	else:
		raise TaskListNotFoundException('Tasklist not found')

def create_tasklist(tasklist_id, password):
	try:
		tasklist = TaskList(tasklist_id, password)
		db_session.add(tasklist)
		db_session.commit()
		return tasklist
	except IntegrityError:
		raise TaskListAlreadyExistsException('TaskList already exists')

def get_tasklist(tasklist_id):
	return db_session.query(TaskList).get(tasklist_id)

def get_tasks(tasklist):
	return db_session.query(Task).filter(Task.tasklist_id==tasklist)\
								 .order_by(Task.id.asc())\
								 .all()

def remove_tasklist(tasklist_id):
	tasklist = get_tasklist(tasklist_id)
	if tasklist:
		db_session.delete(tasklist)
		db_session.commit()
	else:
		raise Exception, "Invalid tasklist id"

# task
def __get_task(task_id):
	return db_session.query(Task).get(task_id)

def create_task(tasklist_id, title):
	task = Task(tasklist_id, title)
	db_session.add(task)
	db_session.commit()
	return task

def update_task_status(task_id, status):
	task = __get_task(task_id)
	if task:
		task.completed = status
		db_session.commit()
		return task
	else:
		raise Exception, "Invalid task id"

def remove_task(task_id):
	task = __get_task(task_id)
	if task:
		db_session.delete(task)
		db_session.commit()
	else:
		raise Exception, "Invalid task id"