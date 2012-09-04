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

  var currentUser;
  var loginForm = $('form#login-form');
/*
  loginForm.on('click', '#login', function() {
    navigator.id.request();
  });

  navigator.id.watch({
    loggedInEmail: currentUser,
    onlogin: function(assertion) {
      loginForm.find('input[name="bid_assertion"]').val(assertion);
      loginForm.submit();
    },
    onlogout: function() { }
  });
*/
  var viewport = $('.target, #viewport');

  viewport.click(function(ev) {
    movement.move(ev);
  });
});
