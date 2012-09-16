'use strict';

module.exports = function(app, db) {
  var user = require('../lib/user');
  var talks = require('../config/characters');
  var locations = require('../config/locations');

  app.get('/', function(req, res) {
    res.render('index', {
      pageType: 'index'
    });
  });

  app.get('/profile', function(req, res) {
    user.getStats(req.session.email, db, function(err, userStat) {
      if (err) {
        res.status(500);
        res.json({ 'message': err });

      } else {
        for (var name in userStat) {
          req.session[name] = userStat[name];
        }

        res.json({
          step: req.session.step,
          inventory: req.session.inventory,
          location: req.session.location,
          todo: req.session.todo
        });
      }
    });
  });

  app.get('/dashboard', function(req, res) {
    res.render('dashboard', {
      pageType: 'dashboard'
    });
  });

  app.get('/location/:id', function(req, res) {
    var location = 'location' + req.params.id;

    res.json({
      name: locations[location].name,
      extra: locations[location].extra,
      characters: locations[location].characters,
      targets: locations[location].targets
    });
  });

  app.post('/talk/:id', function(req, res) {
    var talkState = talks[req.params.id]['step' + req.body.step];
    var step = parseInt(talkState.step, 10) || 2;

    if (req.session.inventory[talkState.requirement]) {
      step = 3;
    }

    req.session.step = step;

    if (talkState.requirement) {
      req.session.todo = talkState.requirement;
    }

    res.json({
      talk: talkState.talk,
      step: step,
      requirement: talkState.requirement,
      targets: talkState.targets
    });
  });
};
