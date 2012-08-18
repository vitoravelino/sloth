define(['mediator', 'notifier', 'models/tasklist'], function() {
  'use strict';

  // dependencies
  var mediator = require('mediator'),
      notifier = require('notifier'),
      TaskList = require('models/tasklist');

  // module code
  var NewTaskListView = Backbone.View.extend({

    tagName: 'section',

    template: _.template($('#tasklist-new-template').html()),

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
      this.inputId.focus();
    },
    
    render: function() {
      this.$el.append(this.template());
      this._cacheElements();
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
  
  return NewTaskListView;

});