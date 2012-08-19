define(['mediator', 'notifier', 'template'], function() {
  'use strict';

  // dependencies
  var mediator        = require('mediator'),
      notifier        = require('notifier'),
      TemplateManager = require('template');

  // module code
  var UnauthorizedView = Backbone.View.extend({

    tagName: 'section',

    template: 'unauthorized',

    events: {
      'submit form': 'authenticate'
    },

    initialize: function() {
      this.taskListId = this.options.taskListId;
    },

    authenticate: function(e) {
      e.preventDefault();

      this.inputPassword.removeClass('input-error');
      mediator.trigger('authorizeSession', {credentials: {tasklist_id: this.taskListId, password: this.inputPassword.val()}, context: this, error: this._handleError});
    },
    
    focus: function() {
      if (this.inputPassword) this.inputPassword.focus();
    },
    
    render: function() {
      var that = this;
      this.$el.html('<img class="preloader" src="/static/img/preloader.gif" alt="Loading..." title="Loading..." />');
      TemplateManager.get(this.template, {data: {tasklist_id: this.taskListId}, callback: function(template) {
        that.$el.html(template);
        that._cacheElements();
        that.focus();
      }});
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

  return UnauthorizedView;

});