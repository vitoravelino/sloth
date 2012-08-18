define(['mediator', 'notifier', 'views/task'], function() {
  'use strict';

  // dependencies
  var mediator = require('mediator'),
      notifier = require('notifier'),
      TaskView = require('views/task');

  // module code
  var TaskListView = Backbone.View.extend({

    tagName: 'section',

    template: _.template($('#tasklist-view-template').html()),
    
    events: {
      'submit form': '_createTask',
      'click .tasklist-filter': '_updateFilter'
    },

    initialize: function() {
      // model events
      this.collection.on('add', this.addTask, this);
      this.collection.on('add', this._clearInput, this);
      this.collection.on('reset', this.addTasks, this);
      this.collection.on('error', this._handleError, this);
      this.collection.fetch();
      
      // other
      this.on('change:filter', this._updateFilter, this);
      this.filter = this.options.filter;
      this.taskListId = this.options.taskListId;
    },

    addTask: function(model) {
      var task = new TaskView({ model: model, collection: this.collection });
      this.list.prepend(task.render().el);
      this.focus();
    },

    addTasks: function() {
      this.list.html('');

      switch(this.filter) {
        case 'completed':
          _.each(this.collection.completed(), this.addTask, this);
          break;
        case 'remaining':
          _.each(this.collection.remaining(), this.addTask, this);
          break;
        default:
          _.each(this.collection.models, this.addTask, this);
          break;
      }
    },
    
    focus: function() {
      this.input.focus();
    },

    render: function() {
      this.$el.append(this.template({tasklist_id: this.taskListId}));
      this._cacheElements();
      return this;
    },

    _cacheElements: function() {
      this.input   = this.$('#task-new-input');
      this.list    = this.$('#task-list');
      this.filters = this.$('#tasklist-filters');
    },

    _clearInput: function() {
      this.input.removeClass('error');
      this.input.val('').blur();
    },
    
    _createTask: function(e) {
      e.preventDefault();

      this.collection.create({ title: this.input.val() }, { wait: true });
    },
    
    _handleError: function(model, resp) {
      switch(resp.status) {
        case 401:
          mediator.trigger('unauthorized');
          break;
        case 404:
          mediator.trigger('notfound');
          break;
        default:
          notifier.notify('Whoops! Something awkward occurred... Fuck!', {timer: 5})
          break
      }
    },

    _updateFilter: function(filter) {
      this.filter = filter;
      this.filters.find('.tasklist-filter-selected').removeClass('tasklist-filter-selected');
      this.filters.find('.tasklist-filter-' + this.filter).addClass('tasklist-filter-selected');
      this.addTasks(); // refresh the tasks based on the filter
    }
  
  });
  
  return TaskListView;

});