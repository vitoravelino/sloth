define(['backbone', 'mediator', 'collections/tasks', 'views/tasklist', 'views/tasklist-access', 'views/tasklist-new', 'views/tasklist-notfound'], function() {
  'use strict';

  // dependencies
  var mediator = require('mediator'),
      TasksCollection = require('collections/tasks'),
      TaskListView = require('views/tasklist'),
      TaskListAccessView = require('views/tasklist-access'),
      NewTaskListView = require('views/tasklist-new'),
      TaskListNotFoundView = require('views/tasklist-notfound');

  // module code
  var Router = Backbone.Router.extend({
    routes: {
      '': 'index',
      ':tasklist': 'viewList',
      ':tasklist/:filter': 'viewByFilter',
      '*path': 'notFound'
    },

    initialize: function() {
      this.$content = $("#content");
      
      mediator.on('unauthorized', this.unauthorized, this);
      mediator.on('notfound', this.notFound, this);
      mediator.on('navigation:change', this._navigationChanged, this);

      Backbone.history.start();
    },

    index: function() {
      if (this.currentView) this.currentView.remove();
      
      this.currentView = new NewTaskListView();
      this.$content.append(this.currentView.render().el);
    },

    unauthorized: function(taskListId) {
      if (this.currentView) this.currentView.remove();
      
      this.currentView = new TaskListAccessView({taskListId: this.taskListId});
      this.$content.append(this.currentView.render().el);
    },

    viewList: function(taskListId) {
      if (this.currentView) this.currentView.remove();

      this.taskListId = taskListId;
      this.currentView = new TaskListView({ taskListId: taskListId, collection: new TasksCollection([], { taskListId: taskListId }) });
      this.$content.append(this.currentView.render().el);
    },

    viewByFilter: function(taskListId, filter) {
      if (this.currentView && !(this.currentView instanceof TaskListView)) {
        this.currentView.remove();
        this.currentView = undefined;
      }
      if (!this.currentView) {
        this.currentView = new TaskListView({ taskListId: taskListId, filter: filter, collection: new TasksCollection([], { taskListId: taskListId }) });
        this.$content.append(this.currentView.render().el);
      }

      this.taskListId = taskListId;
      this.currentView.trigger('change:filter', filter);
    },

    notFound: function() {
      if (this.currentView) this.currentView.remove();
      
      this.currentView = new TaskListNotFoundView({taskListId: this.taskListId});
      this.$content.append(this.currentView.render().el);
    },

    _navigationChanged: function(url) {
      this.navigate(url);
      Backbone.history.loadUrl(url); // necessary if url is the same of current fragment
    }

  });

  return Router;

});