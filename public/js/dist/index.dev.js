"use strict";

var _mapbox = require("./mapbox");

var _help = require("./help");

// import '@babel/polyfill';
// // import { Linter } from 'eslint';
// import anime from 'animejs';
var locations = [72.82119, 18.959125];
(0, _mapbox.displayMap)(locations);
var refreshButton = document.getElementsByClassName('btn-refresh')[0];
refreshButton.addEventListener('click', function (f) {
  navigator.geolocation.getCurrentPosition(function (data) {
    locations[0] = data.coords.longitude;
    locations[1] = data.coords.latitude;
    (0, _mapbox.displayMap)(locations);
  }, function (error) {
    console.log(error);
  }, {
    enableHighAccuracy: false
  });
});
var emergencyButton = document.getElementsByClassName('btn-emergency')[0];

if (emergencyButton) {
  emergencyButton.addEventListener('click', function (f) {
    emergencyButton.style.animationName = 'scaleDown';
    emergencyButton.style.animationDuration = '1s';
  });
}

var helpingLocation = [72.81189, 18.955074];
var helpingButtons = document.getElementsByClassName('emergencies__Card-help');
console.log(helpingButtons);

for (var i = 0; i < helpingButtons.length; i++) {
  (function (index) {
    helpingButtons[index].onclick = function () {
      alert('I am button ' + index);
    };
  })(i);
}

window.emergencyHelp = function () {
  var emergencies = document.getElementById('emergencies');
  emergencies.remove();
  var l1 = document.createElement('main');
  var l2 = document.createElement('section');
  l2.className = 'emergencyMap';
  var buttonRefresh = document.createElement('button');
  buttonRefresh.appendChild(document.createTextNode('Refresh'));
  buttonRefresh.className = 'btn-refresh';
  var Map = document.createElement('div');
  Map.id = 'map';
  l2.appendChild(buttonRefresh);
  l2.appendChild(Map);
  l1.appendChild(l2);
  (0, _help.help)(helpingLocation, locations);
  console.log('Hello');
};