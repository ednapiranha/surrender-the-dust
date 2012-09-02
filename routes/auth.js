var auth = require('../lib/authenticate');

module.exports = function(app, db, nconf, isLoggedIn) {
  // Login
  app.post('/login', function(req, res) {
    auth.verify(req, nconf, function(error, email) {
      if (email) {
        req.session.email = email;
      }
      res.redirect('/dashboard');
    });
  });

  // Logout
  app.get('/logout', isLoggedIn, function(req, res) {
    if (req.session) {
      delete req.session.email;
    }
    res.redirect('/?logged_out=1', 303);
  });
};
