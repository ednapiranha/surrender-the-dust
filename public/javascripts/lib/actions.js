'use strict';

define(['jquery'], function ($) {
  if (!localStorage.getItem('dust_inventory')) {
    localStorage.setItem('dust_inventory', []);
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
    localStorage.setItem('dust_inventory', getPlayerInventory().push(item));
    localStorage.removeItem('dust_todo');
  };
  var getPlayerInventory = function() {
    return localStorage.getItem('dust_inventory');
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
      var img = $('<img src="" class="target inanimate" style="">');
      img.attr('src', targets[i].name)
        .css({
          'left': targets[i].left + 'px'
        });
      dashboard.append(img);
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
    talk: function(self) {
      $.ajax({
        url: '/talk/' + self[0].id,
        type: 'POST',
        data: {
          requirement: getPlayerInventory() || undefined,
          todo: getPlayerTodo() || undefined,
          step: getPlayerStep()
        },
        dataType: 'json'

      }).done(function(data) {
        talk.text(data['talk']);
        talk.fadeIn();
        setPlayerStep(data['step']);
        setPlayerTodo(data['requirement']);
      });
    }
  };

  return self;
});
