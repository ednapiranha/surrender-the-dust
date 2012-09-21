'use strict';

define(['jquery'], function ($) {
  var body = $('body');
  var talk = body.find('#talk');
  var dashboard = body.find('#dashboard');

  // Display all targets for the current step
  var displayTargets = function(targets, profile) {
    var step = parseInt(profile.step, 10);
    var addImg = function(img) {
      img.attr('src', targets[i].name)
        .attr('id', targets[i].id)
        .css({
          'left': targets[i].left + 'px',
          'bottom': targets[i].bottom + 'px'
        });
      dashboard.append(img);
    };

    for (var i = 0; i < targets.length; i ++) {
      var img = $('<img src="" class="target" id="" style="">');
      if (!targets[i].is_inventory) {
        img.addClass('inanimate');
        addImg(img);
      } else {
        if (!profile.inventory[targets[i].id] &&
          !profile.completed[targets[i].id]) {
          img.addClass('inventory');
          addImg(img);
        }
      }
    }
  };

  // Display all characters for the current location
  var displayCharacters = function(characters) {
    for (var i = 0; i < characters.length; i ++) {
      var character = $('<div class="target character"></div>');
      character[0].id = characters[i].name;
      dashboard.append(character);
    }
  };

  var self = {
    // Display current location
    displayLocation: function(profile) {
      $.ajax({
        url: '/location/' + body.data('location'),
        type: 'GET',
        dataType: 'json'

      }).done(function(data) {
        dashboard.removeClass()
          .addClass('movable')
          .addClass(data['name']);
        dashboard.find('#extra').addClass(data['extra']);
        displayCharacters(data['characters']);
        displayTargets(data['targets'], profile);
      });
    },
    // Get a message
    talk: function(self, profile) {
      $.ajax({
        url: '/talk/' + self[0].id,
        type: 'POST',
        data: {
          todo: profile.todo,
          step: profile.step
        },
        dataType: 'json'

      }).done(function(data) {
        talk.text(data['talk']);
        talk.fadeIn();
        profile.step = data['step'];
        profile.inventory = data['inventory'];

        if (data['requirement']) {
          profile.todo = data['requirement'];
        }

        if (data['targets']) {
          displayTargets(data['targets'], profile);
        }

        return profile;
      });
    },
    // Collect inventory
    collectItem: function(self, profile) {
      $.ajax({
        url: '/collect',
        type: 'POST',
        data: {
          inventory: self[0].id
        },
        dataType: 'json'

      }).done(function(data) {
        profile.inventory = data.inventory;
        profile.todo = data.todo;
        profile.step = data.step;
        self.fadeOut();

        return profile;
      });
    }
  };

  return self;
});
