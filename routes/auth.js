'use strict';

module.exports = function(app, db, nconf, isLoggedIn) {
  var auth = require('../lib/authenticate');

  // Login
  app.post('/login', function(req, res) {
    auth.verify(req, nconf, function(err, email) {
      if (err || !email) {
        res.status(500);
        res.json({ 'error': err });

      } else {
        req.session.email = email;
        res.json({
          'message': 'logged in'
        });
      }
    });
  });

  // Logout
  app.get('/logout', isLoggedIn, function(req, res) {
    req.session.reset();
    res.json({
      'message': 'logged out'
    });
  });
};
