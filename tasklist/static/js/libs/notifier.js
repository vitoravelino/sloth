define(function() {
  'use strict';

  var notifier = {
    $el: $('#note'),

    initialize: function() {
      var that = this;
      
      this.$el.click(function(e) { 
        that.close.apply(that);
      });
    },

    notify: function(message, options) {
      var that = this;

      options = _.extend({type: 'error'}, options);
      
      this.$el.find('.message').text(message);
      this.$el.removeClass()
              .addClass('note')
              .addClass('note-' + options.type);
      this.$el.slideDown();
      
      if (options.timer) this.timeout = setTimeout(function() { that.close.apply(that) }, options.timer*1000);
    },

    close: function() {
      if (this.timeout) {
        clearTimeout(this.timeout);
        this.timeout = null;
      }
      this.$el.slideUp();
    }
  }

  notifier.initialize();

  return notifier;
});