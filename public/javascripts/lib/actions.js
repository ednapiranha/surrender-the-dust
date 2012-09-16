'use strict';

define(['jquery'], function ($) {
  if (!localStorage.getItem('dust_inventory')) {
    localStorage.setItem('dust_inventory', JSON.stringify([]));
  }

  var talk = $('#talk');
  var dashboard = $('#dashboard');
  var setPlayerStep = function(step) {
    localStorage.setItem('dust_step', parseInt(step, 10));
  };
  var getPlayerStep = function() {
    return parseInt(localStorage.getItem('dust_step'), 10) || 1;
  };
  var setPlayerInventory = function(item) {
    localStorage.setItem('dust_inventory', JSON.stringify(getPlayerInventory().push(item)));
    localStorage.removeItem('dust_todo');
  };
  var getPlayerInventory = function() {
    return JSON.parse(localStorage.getItem('dust_inventory'));
  };
  var setPlayerTodo = function(item) {
    localStorage.setItem('dust_todo', item);
  };
  var getPlayerTodo = function() {
    return localStorage.getItem('dust_todo');
  };
  var setLocation = function(location) {
    localStorage.setItem('dust_location', location);
  };
  var getLocation = function() {
    return localStorage.getItem('dust_location') || 1;
  };

  // Display all targets for the current step
  var displayTargets = function(targets) {
    for (var i = 0; i < targets.length; i ++) {
      if (!getPlayerInventory[targets[i].id]) {
        var img = $('<img src="" class="target" id="" style="">');
        if (!targets[i].is_inventory) {
          img.addClass('inanimate');
        } else {
          img.addClass('inventory');
        }
        img.attr('src', targets[i].name)
          .attr('id', targets[i].id)
          .css({
            'left': targets[i].left + 'px'
          });
        dashboard.append(img);
      } else {
        console.log('already have inventory item ', targets[i].id)
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
  }

  // Display current location
  var displayLocation = function() {
    $.ajax({
      url: '/location/' + getLocation(),
      type: 'GET',
      dataType: 'json'

    }).done(function(data) {
      dashboard.removeClass()
        .addClass('movable')
        .addClass(data['name']);
      dashboard.find('#extra').addClass(data['extra']);
      displayCharacters(data['characters']);
      displayTargets(data['targets']);
    });
  }

  // Preload location
  displayLocation();

  var self = {
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
        profile.todo = data['requirement'];
        displayTargets(data['targets']);
      });
    },
    // Collect inventory
    collectItem: function(self, profile) {
      if (profile.todo === self[0].id) {
        profile.step = self[0].id;
        self.fadeOut();
      }
    }
  };

  return self;
});
