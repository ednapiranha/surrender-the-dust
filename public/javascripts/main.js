'use strict';

$(function() {
  var currentUser;
  var loginForm = $('form#login-form');

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
});
