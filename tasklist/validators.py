# -*- coding: utf-8 -*-

class TaskValidator():

	@staticmethod
	def valid(task):
		return task["title"] != None and len(task["title"]) > 0

	@staticmethod
	def valid_status(status):
		return status == True or status == False

class TaskListValidator():

	@staticmethod
	def valid(task):
		return task["tasklist_id"] != None and len(task["tasklist_id"]) > 0 and task["password"] != None