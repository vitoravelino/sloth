define(function(require) {
  'use strict';

  // dependencies
  var Task = require('models/task');

  // module code
  var TasksCollection = Backbone.Collection.extend({
    model: Task,

    url: function() {
      return 'api/' + this.taskListId + '/tasks'
    },
    
    initialize: function(models, options) {
      this.taskListId = options.taskListId;
    },

    completed: function() {
      return this.filter(function(model) {
          return model.get('completed');
      });
    },

    remaining: function() {
      return this.filter(function(model) {
          return !model.get('completed');
      });
    }
  });

  return TasksCollection;

});