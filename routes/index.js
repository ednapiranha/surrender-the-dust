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
    delete req.session.completed;

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
          todo: req.session.todo,
          completed: req.session.completed
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
    var targetArr = [];

    locations[location].targets.forEach(function(target) {
      targetArr.push(targets[target]);
    });

    if (req.session.todo && !req.session.inventory[req.session.todo] &&
      parseInt(req.session.step, 10) === 2) {
      targetArr.push(targets[req.session.todo]);
    }

    res.json({
      name: locations[location].name,
      extra: locations[location].extra,
      characters: locations[location].characters,
      targets: targetArr
    });
  });

  app.post('/talk/:id', function(req, res) {
    console.log(req.session)
    var step = parseInt(req.session.step, 10);
    var talkState = talks[req.params.id]['step' + step];
    var targetArr = [];
    var currentLevel = parseInt(req.session.level, 10);
    var endTalkState = function() {
      // We've moved to the next level or we aren't ready to get
      // to this level and should not restart this todo.
      talkState = talks[req.params.id]['step4'];
    };

    if (currentLevel !== talkState.min_level) {
      endTalkState();
    } else  {
      if (step === 3) {
        delete req.session.inventory[talkState.requirement];
        req.session.completed[talkState.requirement] = true;
        req.session.level = parseInt(req.session.level, 10) + 1;
        req.session.step = 1;

      } else if (step < 3) {
        req.session.step = step = 2;
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
        endTalkState();
        req.session.step = 1;
      }
    }

    user.saveStats(req, db, function(data) {
      res.json({
        talk: talkState.talk,
        step: step,
        requirement: talkState.requirement,
        targets: targetArr,
        characters: talkState.characters,
        inventory: req.session.inventory
      });
    });
  });

  app.post('/collect', function(req, res) {
    req.session.inventory[req.body.inventory] = targets[req.body.inventory];
    if (req.body.inventory.indexOf('equip_') === -1) {
      req.session.step = 3;
      req.session.todo = null;
    }

    user.saveStats(req, db, function() {
      res.json({
        'inventory': req.session.inventory,
        'todo': req.session.todo
      });
    });
  });
};
