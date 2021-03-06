define(['mediator', 'notifier', 'sloth', 'views/task'], function() {
  'use strict';

  // dependencies
  var mediator = require('mediator'),
      notifier = require('notifier'),
      Sloth    = require('sloth'),
      TaskView = require('views/task');

  // module code
  var TaskListView = Sloth.View.extend({

    tagName: 'section',

    template: 'tasklist',
    
    events: {
      'submit form': '_createTask',
    },

    initialize: function() {
      // model events
      this.collection.on('add', this.addTask, this);
      this.collection.on('add', this._clearInput, this);
      this.collection.on('reset', this.addTasks, this);
      this.collection.on('error', this._handleError, this);
      this.collection.on('change:completed', this._updateTask, this);

      this.filter     = this.options.filter || 'all';
      this.taskListId = this.options.taskListId;
    },

    addTask: function(model) {
      var task = new TaskView({ model: model, collection: this.collection });
      if (this._hasToDisplay(model)) this.list.prepend(task.render().el);
    },

    addTasks: function() {
      if (!this.isRendered) return;

      this.list.html('');
      this._updateUIFilter();

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
    
    cacheElements: function() {
      this.input   = this.$('#task-new-input');
      this.list    = this.$('#task-list');
      this.filters = this.$('#tasklist-filters');
    },
    
    focus: function() {
      if (this.input) this.input.focus();
    },

    render: function() {
      this.$el.html('<img class="preloader" src="/static/img/preloader.gif" alt="Loading..." title="Loading..." />');
      this.loadTemplate({tasklist_id: this.taskListId});

      return this;
    },
    
    rendered: function() {
      this.collection.fetch();
    },

    updateFilter: function(filter) {
      this.filter = filter;
      this.addTasks(); // refresh the tasks based on the filter
    },

    _clearInput: function() {
      this.input.removeClass('error');
      this.input.val('');
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

    _hasToDisplay: function(model) {
      return this.filter === 'all' ||
             this.filter === 'completed' && model.get('completed') ||
             this.filter === 'remaining' && !model.get('completed');
    },

    _updateTask: function(model) {
      if (!this._hasToDisplay(model)) model.trigger('hide');
    },

    _updateUIFilter: function() {
      this.filters.find('.tasklist-filter-selected').removeClass('tasklist-filter-selected');
      this.filters.find('.tasklist-filter-' + this.filter).addClass('tasklist-filter-selected');
    }
  
  });
  
  return TaskListView;

});