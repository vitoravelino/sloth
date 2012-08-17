define(function(require) {
  'use strict';

  // dependencies
  var mediator = require('mediator');

  // module code
  var TaskView = Backbone.View.extend({
    
    tagName: 'li',

    className: 'tasklist-item',

    template: _.template($('#task-template').html()),

    events: {
      'click .tasklist-item-delete': 'destroyTask',
      'click .checkbox': 'updateStatus'
    },

    initialize: function() {
      // model events
      this.model.on('destroy', this.remove, this); // remover eventos com off()
      this.model.on('error', this._handleError, this);
    },

    updateStatus: function() {
      this.$el.toggleClass('tasklist-item-done');
      this.model.toggle();
    },
    
    destroyTask: function() {
      this.model.destroy();
    },

    render: function() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$el.toggleClass('tasklist-item-done', this.model.get('completed'));
      return this;
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
          mediator.trigger('fuuuu');
          break
      }
    },
  });

  return TaskView;

});