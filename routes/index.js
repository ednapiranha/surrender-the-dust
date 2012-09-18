'use strict';

module.exports = function(app, db) {
  var user = require('../lib/user');
  var talks = require('../config/characters');
  var targets = require('../config/targets');
  var locations = require('../config/locations');

  app.get('/', function(req, res) {
    res.render('index', {
      pageType: 'index'
    });
  });

  app.get('/reset', function(req, res) {
    delete req.session.todo;
    delete req.session.inventory;
    delete req.session.location;
    delete req.session.step;
    delete req.session.level;

    user.saveStats(req, db, function() {
      res.redirect('/dashboard');
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
      location: req.session.location || 1,
      pageType: 'dashboard'
    });
  });

  app.get('/location/:id', function(req, res) {
    var location = 'location' + req.params.id;

    if (req.session.todo && !req.session.inventory[req.session.todo] &&
      parseInt(req.session.step, 10) === 2) {

      locations[location].targets.push(targets[req.session.todo]);
    }

    res.json({
      name: locations[location].name,
      extra: locations[location].extra,
      characters: locations[location].characters,
      targets: locations[location].targets
    });
  });

  app.post('/talk/:id', function(req, res) {
    var step = parseInt(req.session.step, 10);
    var talkState = talks[req.params.id]['step' + step];
    var currentLevel = parseInt(req.session.level, 10);
    console.log(req.session)
    if (step === 3) {
      delete req.session.inventory[talkState.requirement];
      req.session.level = parseInt(req.session.level, 10) + 1;
      req.session.step = 1;

    } else if (step < 3 && currentLevel <= talkState.min_level) {
      req.session.step = step = 2;

      var targetArr = [];

      talkState.targets.forEach(function(targetName) {
        // If the location has already displayed this target, don't redisplay
        // from the character interaction.
        if (req.session.todo !== targetName) {
          targetArr.push(targets[targetName]);
        }
      });

      if (talkState.requirement) {
        req.session.todo = talkState.requirement;
      }
    } else {
      // We've moved to the next level and should not restart this todo.
      talkState = talks[req.params.id]['step4'];
      req.session.step = 1;
    }

    user.saveStats(req, db, function(data) {
      res.json({
        talk: talkState.talk,
        step: step,
        requirement: talkState.requirement,
        targets: targetArr,
        characters: talkState.characters
      });
    });
  });

  app.post('/collect', function(req, res) {
    req.session.inventory[req.body.inventory] = true;
    req.session.todo = null;
    req.session.step = 3;

    user.saveStats(req, db, function() {
      res.json({
        'inventory': req.session.inventory,
        'todo': req.session.todo
      });
    });
  });
};
