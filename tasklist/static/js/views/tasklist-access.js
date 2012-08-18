define(['mediator', 'notifier'], function() {
  'use strict';

  // dependencies
  var mediator = require('mediator'),
      notifier = require('notifier');

  // module code
  var TaskListAccessView = Backbone.View.extend({

    tagName: 'section',

    template: _.template($('#tasklist-access-template').html()),

    events: {
      'submit form': 'authenticate'
    },

    initialize: function() {
      this.taskListId = this.options.taskListId;
    },

    authenticate: function(e) {
      e.preventDefault();

      this.inputPassword.removeClass('input-error');
      mediator.trigger('authorizeSession', { credentials: {tasklist_id: this.taskListId, password: this.inputPassword.val()}, context: this, error: this._handleError });
    },
    
    focus: function() {
      this.inputPassword.focus();
    },
    
    render: function() {
      this.$el.append(this.template({tasklist_id: this.taskListId}));
      this._cacheElements();
      return this;
    },

    _cacheElements: function() {
      this.inputPassword = this.$('#tasklist-input-password');
    },

    _handleError: function(resp) {
      switch(resp.status) {
        case 401:
          notifier.notify('Whoops! Wrong password. Try again!', {timer: 5})
          this.inputPassword.addClass('input-error');
          break;
        default:
          notifier.notify('Whoops! Something awkward occurred... Fuck!', {timer: 10})
          break
      }
    }

  });

  return TaskListAccessView;

});