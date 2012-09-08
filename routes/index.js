'use strict';

module.exports = function(app, db) {
  var talks = require('../config/characters');
  var locations = require('../config/locations');

  app.get('/', function(req, res) {
    res.render('index', {
      pageType: 'index'
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

    if (req.body.requirement && req.body.requirement === talkState.requirement) {
      step = 3;
    }

    res.json({
      talk: talkState.talk,
      step: step,
      requirement: talkState.requirement,
      targets: talkState.targets
    });
  });
};
