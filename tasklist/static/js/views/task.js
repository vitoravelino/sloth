define(['mediator', 'sloth'], function() {
  'use strict';

  // dependencies
  var mediator = require('mediator'),
      Sloth    = require('sloth');

  // module code
  var TaskView = Sloth.View.extend({
    
    tagName: 'li',

    className: 'tasklist-item',

    template: 'task',

    events: {
      'click .tasklist-item-delete': 'destroyTask',
      'click .checkbox': 'updateStatus'
    },

    initialize: function() {
      // model events
      this.model.on('destroy', this.remove, this);
      this.model.on('hide', this.remove, this);
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
      this.$el.html('<img class="preloader" src="/static/img/preloader.gif" alt="Loading..." title="Loading..." />');
      this.loadTemplate(this.model.toJSON());
      
      return this;
    },

    rendered: function() {
      this.$el.toggleClass('tasklist-item-done', this.model.get('completed'));
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
    }
    
  });

  return TaskView;

});