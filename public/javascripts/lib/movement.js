'use strict';

define(['jquery'], function ($) {
  var actionLength = 2000;
  var isRunning = false;
  var protagonist = $('.protagonist');
  var targets = $('.target');
  var viewport = $('#viewport');
  var movable = $('.movable');
  var currPanel = 1;

  var SPEED = 8;
  var RADIUS_MAX = 100;
  var VIEWPORT_SPEED = 800;
  var VIEWPORT_LEFT = -10;
  var VIEWPORT_RIGHT = -750;
  var VICINITY = -30;
  var PROTAGONIST_LANDING = 120;
  var MIN_PROTAGONIST_LEFT = 10;
  var MAX_PROTAGONIST_RIGHT = 2290;

  var moveProtagonist = function(toX, actionLength, callback) {
    if (toX > MIN_PROTAGONIST_LEFT && toX < MAX_PROTAGONIST_RIGHT) {
      isRunning = true;
      protagonist.addClass('active');
      protagonist.animate({
        left: toX
      },
      actionLength, 'linear', function() {
        protagonist.removeClass('active');
        if (callback) {
          callback();
        }
        isRunning = false;
      });
    }
  };

  var walkAcross = function(toX, actionLength, ev) {
    var currTarget = $(ev.target);

    if (currTarget.hasClass('navigation')) {
      if (viewport.data('viewport') === 'left' && currTarget.attr('id') === 'right') {
        moveProtagonist(toX + PROTAGONIST_LANDING, actionLength, function() {
          moveViewPort(VIEWPORT_RIGHT);
          currPanel = 2;
          viewport.data('viewport', 'right');
        });
      } else if (viewport.data('viewport') === 'right' && currTarget.attr('id') === 'left') {
        if (currPanel > 1) {
          actionLength += 2000;
        }

        if (currPanel === 3) {
          moveProtagonist(toX - PROTAGONIST_LANDING, actionLength, function() {
            moveViewPort(VIEWPORT_RIGHT);
            currPanel = 2;
            viewport.data('viewport', 'right');
          });
        } else {
          moveProtagonist(toX - PROTAGONIST_LANDING, actionLength, function() {
            moveViewPort(VIEWPORT_LEFT);
            currPanel = 1;
            viewport.data('viewport', 'left');
          });
        }
      } else if (viewport.data('viewport') === 'right' && currTarget.attr('id') === 'right') {
        moveProtagonist(toX + PROTAGONIST_LANDING, actionLength + 1000, function() {
          moveViewPort(VIEWPORT_RIGHT * 2);
          currPanel = 3;
        });
      }
      isRunning = false;
    } else {
      moveProtagonist(toX, actionLength);
    }
  };

  var moveViewPort = function(toX, callback) {
    movable.animate({
      marginLeft: toX
    },
    VIEWPORT_SPEED, function() {
      protagonist.removeClass('active');
      isRunning = false;
      if (callback) {
        callback();
      }
    });
  };

  var self = {
    // Move towards a target and stop in a specificed vicinity.
    move: function(ev) {
      if (!isRunning) {
        var toX = ev.pageX;
        var fromX = protagonist.position().left;
        var difference;

        targets.removeClass('actionable');
        isRunning = true;
        protagonist.removeClass('active');

        if (viewport.data('viewport') === 'right') {
          toX += VIEWPORT_RIGHT * -1 * (currPanel - 1);
          fromX += currPanel * -1;
        }

        // Moving right
        if (fromX < toX) {
          difference = toX - fromX;
          protagonist.addClass('opposite');

        // Moving left
        } else {
          difference = fromX - toX;
          protagonist.removeClass('opposite');
        }

        actionLength = difference * SPEED;
        toX += VICINITY;
        walkAcross(toX, actionLength, ev);
      }
    }
  };

  return self;
});
