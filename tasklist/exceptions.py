# -*- coding: utf-8 -*-

class TaskListException(Exception):

	def __init__(self, message):
		self.message = message

class TaskNotFoundException(TaskListException):
    pass

class TaskListAlreadyExistsException(TaskListException):
    pass

class TaskListNotFoundException(TaskListException):
    pass