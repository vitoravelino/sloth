# -*- coding: utf-8 -*-

from sqlalchemy import Column, Integer, String, Boolean, ForeignKey
from sqlalchemy.orm import relationship

from tasklist.database import Base

class TaskList(Base):
	__tablename__ = 'tasklists'
	
	id = Column(String, primary_key=True)
	password = Column(String)
	tasks = relationship("Task", order_by="Task.id")

	def __init__(self, id, password):
		 self.id = id
		 self.password = password

	def to_dict(self):
		return {'id': self.id, 'password': self.password}

class Task(Base):
	__tablename__ = 'tasks'

	id = Column(Integer, primary_key=True)
	title = Column(String)
	completed = Column(Boolean)
	tasklist_id = Column(String, ForeignKey('tasklists.id'))

	def __init__(self, tasklist_id, title, completed):
		 self.title = title
		 self.completed = False
		 self.tasklist_id = tasklist_id
		 self.completed = completed

	def to_dict(self):
		return {'id': self.id, 'title': self.title, 'completed': self.completed}