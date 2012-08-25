define(['backbone'], function() {
  'use strict';

  // module code
  var Task = Backbone.Model.extend({
    
    defaults: function() {
      return {
        title: '',
        completed: false
      };
    },

    toggle: function() {
      this.save('completed', !this.get('completed'), {wait: true});
    }

  });

  return Task;

});