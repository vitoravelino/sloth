define(['mediator', 'notifier', 'template', 'views/task'], function() {
  'use strict';

  // dependencies
  var mediator        = require('mediator'),
      notifier        = require('notifier'),
      TemplateManager = require('template'),
      TaskView        = require('views/task');

  // module code
  var TaskListView = Backbone.View.extend({

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
      
      // other
      this.on('rendered', this.collection.fetch, this.collection);
      
      this.filter     = this.options.filter;
      this.taskListId = this.options.taskListId;
    },

    addTask: function(model) {
      var task = new TaskView({ model: model, collection: this.collection });
      this.list.prepend(task.render().el);
      this.focus();
    },

    addTasks: function() {
      if (!this.rendered) return;
      
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
    
    focus: function() {
      if (this.input) this.input.focus();
    },

    render: function() {
      var that = this;
      this.$el.html('<img class="preloader" src="/static/img/preloader.gif" alt="Loading..." title="Loading..." />');
      //this.loadTemplate({tasklist_id: this.taskListId});

      TemplateManager.get(this.template, {data: {tasklist_id: this.taskListId}, callback: function(template) {
        that.$el.html(template);
        that.rendered = true;
        that._cacheElements();
        that.focus();
        that.trigger('rendered');
      }});
      return this;
    },

    updateFilter: function(filter) {
      this.filter = filter;
      this.addTasks(); // refresh the tasks based on the filter
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

    _updateUIFilter: function() {
      this.filters.find('.tasklist-filter-selected').removeClass('tasklist-filter-selected');
      this.filters.find('.tasklist-filter-' + this.filter).addClass('tasklist-filter-selected');
    }
  
  });
  
  return TaskListView;

});