# -*- coding: utf-8 -*-

class TaskValidator():

	@staticmethod
	def valid(task):
		return task["title"] != None and len(task["title"]) > 0 and \
               task["completed"] != None


class TaskListValidator():

	@staticmethod
	def valid(task):
		return task["tasklist_id"] != None and len(task["tasklist_id"]) > 0 and task["password"] != None