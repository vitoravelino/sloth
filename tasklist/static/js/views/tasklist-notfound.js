define(['backbone'], function() {
  'use strict';

  // module code
  var TaskListNotFoundView = Backbone.View.extend({

    tagName: 'section',

    template: _.template($('#tasklist-notfound-template').html()),

    initialize: function() {
      this.taskListId = this.options.taskListId;
    },

    render: function() {
      this.$el.append(this.template({tasklist_id: this.taskListId}));
      return this;
    },

  });

  return TaskListNotFoundView;

});