define(['backbone', 'mediator', 'collections/tasks', 'views/tasklist', 'views/unauthorized', 'views/index', 'views/notfound'], function() {
  'use strict';

  // dependencies
  var mediator         = require('mediator'),
      TasksCollection  = require('collections/tasks'),
      TaskListView     = require('views/tasklist'),
      UnauthorizedView = require('views/unauthorized'),
      IndexView        = require('views/index'),
      NotFoundView     = require('views/notfound');

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
      
      this.currentView = new IndexView();
      this.$content.html(this.currentView.render().el);
      this.currentView.focus();
    },

    unauthorized: function(taskListId) {
      if (this.currentView) this.currentView.remove();
      
      this.currentView = new UnauthorizedView({taskListId: this.taskListId});
      this.$content.html(this.currentView.render().el);
      this.currentView.focus();
    },

    viewList: function(taskListId) {
      if (this.currentView) this.currentView.remove();

      this.taskListId = taskListId;
      this.currentView = new TaskListView({ taskListId: taskListId, collection: new TasksCollection([], { taskListId: taskListId }) });
      this.$content.html(this.currentView.render().el);
      this.currentView.focus();
    },

    viewByFilter: function(taskListId, filter) {
      if (this.currentView && !(this.currentView instanceof TaskListView)) {
        this.currentView.remove();
        this.currentView = undefined;
      }
      if (!this.currentView) {
        this.taskListId = taskListId;
        this.currentView = new TaskListView({ taskListId: taskListId, filter: filter, collection: new TasksCollection([], { taskListId: taskListId }) });
        this.$content.html(this.currentView.render().el);
      }

      this.currentView.updateFilter(filter);
      this.currentView.focus();
    },

    notFound: function() {
      if (this.currentView) this.currentView.remove();
      
      this.currentView = new NotFoundView({taskListId: this.taskListId});
      this.$content.html(this.currentView.render().el);
    },

    _navigationChanged: function(url) {
      this.navigate('#/' + url);
      Backbone.history.loadUrl(url); // necessary if url is the same of current fragment
    }

  });

  return Router;

});