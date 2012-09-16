'use strict';

var utils = require('./utils');

var userInit = function(req) {
  var user = {
    email: req.session.email,
    step: req.session.step || 1,
    inventory: req.session.inventory || {},
    todo: req.session.todo || '',
    location: req.session.lcation || 1
  };

  return user;
};

var setHash = function(db, userKey, user, name) {
  if (typeof user[name] === 'object') {
    db.hset(userKey, name, JSON.stringify(user[name]), function(err, resp) { });

  } else {
    db.hset(userKey, name, user[name], function(err, resp) { });
  }
};

/* Set user info
 * Requires: web request, db connection
 * Returns: A hash of the user's current game settings
 */
exports.saveStats = function(req, db, callback) {
  var userKey = 'player:' + req.session.email;
  var user = userInit(req);

  for (var name in user) {
    setHash(db, userKey, user, name);
  }

  callback(null, user);
};

/* Get user info
 * Requires: email, db connection
 * Returns: A hash of the user's current score settings
 */
exports.getStats = function(email, db, callback) {
  var userKey = 'player:' + email;

  db.hgetall(userKey, function(err, userItems) {
    if (err) {
      callback(err);

    } else {
      if (!userItems) {
        // User hasn't been created
        var req = {
          session: {
            email: email
          }
        };

        userItems = userInit(req);

      } else {
        userItems.inventory = utils.loadJSONObject(userItems.inventory);
      }
      console.log(userItems)
      callback(null, userItems);
    }
  });
};

var deleteHash = function(db, userKey, name) {
  db.hdel(userKey, name, function(err, resp) { });
};

/* Reset user stats
 * Requires: web request, db connection
 * Returns: True when completed
 */
exports.resetStats = function(req, db, callback) {
  var userKey = 'player:' + req.session.email;

  for (var name in req.session) {
    deleteHash(db, userKey, name);
  }

  callback(null, true);
};
