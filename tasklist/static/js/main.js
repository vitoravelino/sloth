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
        backbone: 'vendor/backbone-0.9.2',
        jquery: 'vendor/jquery-1.8.0.min',
        lodash: 'vendor/lodash-0.4.2.min',
        auth: 'libs/auth',
        mediator: 'libs/mediator',
        notifier: 'libs/notifier',
        sloth: 'libs/sloth',
        template: 'libs/template'
    }
});

// bootstraping the app
define(['backbone', 'routers/router', 'auth'], function() {
  var Router       = require('routers/router'),
      AuthMediator = require('auth');

  new Router();
  new AuthMediator();
});