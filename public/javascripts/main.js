'use strict';

requirejs.config({
  baseUrl: '/javascripts/lib',
  enforceDefine: true,
  paths: {
    jquery: 'https://ajax.googleapis.com/ajax/libs/jquery/1.8.0/jquery.min'
  }
});

define(['jquery', 'movement'],
  function($, movement) {

  var viewport = $('.target, #viewport');
  var target = $('.target');

  viewport.click(function(ev) {
    movement.move(ev);
  });

  target.click(function(ev) {
    var self = $(this);

    movement.withinRadius(ev, self);
  });
});
