'use strict';

define(['jquery'], function ($) {
  var actionLength = 2000;
  var isRunning = false;
  var protagonist = $('.protagonist');

  var SPEED = 8;

  var walkAcross = function(newX, actionLength) {
    protagonist.addClass('active');
    protagonist.animate({
      left: newX
    }, actionLength, function() {
      protagonist.removeClass('active');
      isRunning = false;
    });
  };

  var self = {
    move: function(self) {
      if (!isRunning) {
        isRunning = true;
        protagonist.removeClass('active');
        var newX = self.position().left;
        var currX = protagonist.position().left;

        if (currX < newX) {
          var difference = newX - currX;
          protagonist.addClass('opposite');
          actionLength = difference * SPEED;

          if (difference > 45) {
            newX = newX - 45;
            walkAcross(newX, actionLength);
          }
        } else {
          var difference = currX - newX;
          protagonist.removeClass('opposite');
          actionLength = difference * SPEED;

          if (difference > 90) {
            newX = newX + 90;
            walkAcross(newX, actionLength);
          }
        }
      }
    }
  };

  return self;
});
