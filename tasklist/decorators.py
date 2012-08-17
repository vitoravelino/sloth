from flask import request
from functools import wraps

from tasklist import models
from tasklist.utils import render_json, cache

##############
# DECORATORS #
##############
def tasklist_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        tasklist = models.get_tasklist(kwargs.get('tasklist_id'))
        if not tasklist:
            return render_json('{"error": "Tasklist not found"}'), 404
        return func(*args, **kwargs)
    return decorated_view

def token_required(func):
    @wraps(func)
    def decorated_view(*args, **kwargs):
        token = request.args.get('token') or (request.json is not None and request.json['authentication']['token'])
        cacheToken = cache.get('key' + kwargs.get('tasklist_id'))
        if cacheToken != token:
            return render_json('{"error": "Authentication required"}'), 401
        return func(*args, **kwargs)
    return decorated_view
