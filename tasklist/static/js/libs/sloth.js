define(['backbone', 'template'], function() {
  'use strict';

  // dependencies
  var TemplateManager = require('template');

  var Sloth = {};

  Sloth.View = Backbone.View.extend({
    
    template: '',

    // **focus** is the function that your view should override, in order
    // to provide autofocus to an element after the view is rendered.
    // The convention is for **focus** to always return `this`.
    focus: function() {
        return this;
    },

    // **cacheElements** is the function that your view should override, in order
    // to cache elements in its template to avoid unecessary search for an element.
    // The convention is for **cacheElements** to always return `this`.
    cacheElements: function() {
        return this;
    },

    // **close** is the function that removes the view's events and detach it 
    // from DOM. It also calls **onClose** function.
    close: function() { 
      this.off();
      this.onClose();
      this.remove();
    },

    loadTemplate: function(data) {
      var that = this;
      
      TemplateManager.get(this.template, {data: data, callback: function(template) {
          that.$el.html(template);
          that.isRendered = true;
          that.cacheElements();
          that.focus();
          that.rendered();
      }});
    },
    // **onClose** is the function that your view should override, in order
    // to do anything after closing the view. By default, it removes events
    // from model and collection if exists.
    onClose: function() {
      if (this.model) this.model.off();
      if (this.collection) this.collection.off();
    },

    // **rendered** is the function that your view should override, in order
    // to do something that involves the DOM if necessary.
    rendered: function() { }

  });

  return Sloth;

});