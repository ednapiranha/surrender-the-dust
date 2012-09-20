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

  // Persona authentication
  var login = $('#login');
  var logout = $('#logout');

  var profile = {};

  // Initialize on load
  $.get('/profile', function(data) {
    profile = {
      step: data.step,
      inventory: data.inventory,
      todo: data.todo,
      location: data.location,
      completed: data.completed
    };

    actions.displayLocation(profile);
  });

  login.click(function(ev) {
    ev.preventDefault();
    navigator.id.request();
  });

  logout.click(function(ev) {
    ev.preventDefault();
    navigator.id.request();
  });

  /*
  navigator.id.watch({
    loggedInEmail: currentUser,
    onlogin: function(assertion) {
      $.ajax({
        type: 'POST',
        url: '/login',
        data: { assertion: assertion },
        success: function(res, status, xhr) {
          window.location.reload();
        },
        error: function(res, status, xhr) {
          alert('login failure ' + res);
        }
      });
    },
    onlogout: function() {
      $.ajax({
        type: 'GET',
        url: '/logout',
        success: function(res, status, xhr) {
          window.location.reload();
        },
        error: function(res, status, xhr) {
          console.log('logout failure ' + res);
        }
      });
    }
  });
  */

  var dashboard = $('#dashboard');

  // Navigating around the viewport
  dashboard.on('click', '#viewport, .target', function(ev) {
    var self = $(this);

    movement.move(ev);
  });

  // Activating speech on a target
  dashboard.on('click', '.target', function() {
    var self = $(this);

    movement.withinRadius(self, function() {
      if (self.hasClass('actionable')) {
        actions.talk(self, profile, function(data) {
          profile = data;
        });
      } else if (self.hasClass('inventory')) {
        actions.collectItem(self, profile, function(data) {
          profile = data;
        });
      }
    });
  });
});
