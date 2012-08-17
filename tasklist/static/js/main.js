require.config({

    baseUrl: 'static/js/',

    shim: {
        'jquery': {
            exports: '$'
        },
        'lodash': {
           exports: '_'
        },
        'backbone': {
            deps: ['lodash', 'jquery'],
            exports: 'Backbone'
        },
    },

    paths: {
        jquery: 'vendor/jquery-1.8.0.min',
        lodash: 'vendor/lodash-0.4.2.min',
        backbone: 'vendor/backbone-0.9.2',
        mediator: 'libs/mediator',
        notifier: 'libs/notifier',
        text: 'libs/text'
    }
});

// bootstraping the app
define(function(require) {
  require('backbone'); // the whole app uses it

  var Router = require('routers/router'),
      AuthMediator = require('auth');

  new Router();
  new AuthMediator();
});