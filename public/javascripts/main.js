'use strict';

requirejs.config({
  baseUrl: '/javascripts/lib',
  enforceDefine: true,
  paths: {
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min'
  }
});

define(['jquery', 'movement', 'actions'],
  function($, movement, actions) {

  var dashboard = $('#dashboard');

  // Navigating around the viewport
  dashboard.on('click', '#viewport', function(ev) {
    var self = $(this);

    movement.move(ev);
  });

  // Activating speech on a target
  dashboard.on('click', '.target', function(ev) {
    var self = $(this);

    movement.withinRadius(ev, self, function() {
      if (self.hasClass('actionable')) {
        actions.talk(self);
      }
    });
  });
});
