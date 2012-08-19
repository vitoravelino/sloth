define(['mediator', 'notifier', 'template', 'models/tasklist'], function() {
  'use strict';

  // dependencies
  var mediator        = require('mediator'),
      notifier        = require('notifier'),
      TemplateManager = require('template'),
      TaskList        = require('models/tasklist');

  // module code
  var IndexView = Backbone.View.extend({

    template: 'index',

    events: {
      'submit #existent-tasklist': '_accessTasklist',
      'submit #new-tasklist': '_createTaskList'
    },

    initialize: function() {
      this.model = new TaskList();
      this.model.on('change', this._created, this);
      this.model.on('error', this._handleError, this);
    },

    focus: function() {
      if (this.inputId) this.inputId.focus();
    },
    
    render: function() {
      var that = this;
      this.$el.html('<img class="preloader" src="/static/img/preloader.gif" alt="Loading..." title="Loading..." />');
      TemplateManager.get(this.template, {callback: function(template) {
        that.$el.html(template);
        that._cacheElements();
        that.focus();
      }});

      return this;
    },
    
    _accessTasklist: function(e) {
      e.preventDefault();

      mediator.trigger('navigation:change', this.$('#existent-tasklist-input-id').val());
    },

    _cacheElements: function() {
      this.inputId = this.$('#tasklist-input-id');
      this.inputPassword = this.$('#tasklist-input-password');
    },

    _created: function(tasklist) {
      mediator.trigger('authorizeSession', { credentials: {tasklist_id: tasklist.id, password: tasklist.get('password')}, context: this, error: this._handleError });
    },

    _createTaskList: function(e) {
      e.preventDefault();
      this.inputId.removeClass('input-error');
      
      if (this._validInput()) {
        this.model.save({ tasklist_id: this.inputId.val(), password: this.inputPassword.val() }, { wait: true });
      }
    },

    _handleError: function(model, resp) {
      switch(resp.status) {
        case 409:
          notifier.notify('Whoops! This tasklist id already exists. Try another!', {timer: 5})
          this.inputId.addClass('input-error').focus();
          break;
        default:
          notifier.notify('Whoops! Something awkward occurred... Fuck!', {timer: 10})
          this.inputId.addClass('input-error').focus();
          break
      }
    },

    _validInput: function() {
      return this.inputId.val().length && this.inputPassword.length;
    }

  });
  
  return IndexView;

});