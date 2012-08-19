define(['sloth'], function() {
  'use strict';

  // dependencies
  var Sloth = require('sloth');

  // module code
  var NotFoundView = Sloth.View.extend({

    tagName: 'section',

    template: 'notfound',

    initialize: function() {
      this.taskListId = this.options.taskListId;
    },

    render: function() {
      this.$el.html('<img class="preloader" src="/static/img/preloader.gif" alt="Loading..." title="Loading..." />');
      this.loadTemplate({tasklist_id: this.taskListId});

      return this;
    }

  });

  return NotFoundView;

});