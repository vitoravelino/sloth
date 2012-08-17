# -*- coding: utf-8 -*-

from flask import request, make_response
from werkzeug.contrib.cache import SimpleCache

import json, uuid, random, string

# OBJECTS

cache = SimpleCache()

#############
# FUNCTIONS #
#############

def to_json(obj):
	if isinstance(obj, list):
		return json.dumps([obj.to_dict() for obj in obj])
	else:
		return json.dumps(obj.to_dict())

def render_json(output, callback=''):
	callback = request.args.get('callback', '')
	if callback: output = "%s(%s)" % (callback, output)
	response = make_response(output)
	response.headers['Content-Type'] = 'application/json'
	return response

def generate_uuid(string):
	return str(uuid.uuid3(uuid.NAMESPACE_DNS, random_string()))

def random_string(size=24):
	return ''.join(random.choice(string.uppercase + string.digits) for x in range(size))