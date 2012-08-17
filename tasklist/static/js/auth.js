define(function(require) {
  'use strict';

  // dependencies
  var mediator = require('mediator');

  // module code
  var AuthMediator = function() {
    mediator.on('authorizeSession', this.authorize, this);
    mediator.on('clearSession', this.clearSession, this);
  }

  _.extend(AuthMediator.prototype, {

    authorize: function(options) {
      $.ajax({
        type: 'POST',
        url: 'api/get_token', 
        data: JSON.stringify(options.credentials),
        contentType: 'application/json',
        dataType: 'json',
        context: (options.context || this),
        success: (options.success || this._authorizationSuccessCallback),
        error: (options.error || this._authorizationErrorCallback)
      });
    },

    _authorizationSuccessCallback: function(resp) {
      sessionStorage.setItem('token', resp.token);
      mediator.trigger('navigation:change', (Backbone.history.fragment || resp.tasklist_id));
    },

    _authorizationErrorCallback: function(data, resp) {
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
    
    _clearSession: function() {
      sessionStorage.clear();
    },
  });

  return AuthMediator;

});