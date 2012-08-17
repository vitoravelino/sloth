define(['backbone'], function() {
  'use strict';

  // module code
  var TaskList = Backbone.Model.extend({
    url: function() {
        return this.id ? 'api/tasklists/' + this.id : 'api/tasklists';
    }
  });

  return TaskList;

});