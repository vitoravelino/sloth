define(['backbone', 'template'], function() {
  'use strict';

  // dependencies
  var TemplateManager = require('template');

  // module code
  var NotFoundView = Backbone.View.extend({

    tagName: 'section',

    template: 'notfound',

    initialize: function() {
      this.taskListId = this.options.taskListId;
    },

    render: function() {
      var that = this;
      this.$el.html('<img class="preloader" src="/static/img/preloader.gif" alt="Loading..." title="Loading..." />');
      TemplateManager.get(this.template, {data: {tasklist_id: this.taskListId}, callback: function(template) {
        that.$el.html(template);
      }});

      return this;
    }

  });

  return NotFoundView;

});