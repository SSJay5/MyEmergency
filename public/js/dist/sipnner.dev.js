"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.spinner = void 0;

/*eslint-disable*/
var spinnerAddColor = function spinnerAddColor(color) {
  var l2 = document.createElement('div');
  l2.className = "spinner-layer spinner-".concat(color); // console.log(l2);

  var l3 = document.createElement('div');
  l3.className = 'circle-clipper left';
  var l31 = document.createElement('div');
  l31.className = 'circle';
  l3.appendChild(l31); // console.log(l3);

  var l4 = document.createElement('div');
  l4.className = 'gap-patch';
  var l41 = document.createElement('div');
  l41.className = 'circle';
  l4.appendChild(l41);
  var l5 = document.createElement('div');
  l5.className = 'circle-clipper right';
  var l51 = document.createElement('div');
  l51.className = 'circle';
  l5.appendChild(l51);
  l2.appendChild(l3);
  l2.appendChild(l4);
  l2.appendChild(l5);
  return l2;
};

var spinner = function spinner(type) {
  if (type === 'add') {
    var L1 = document.createElement('div');
    L1.id = 'sipnnerEmergency'; // console.log(L1);

    var L2 = document.createElement('div');
    L2.className = 'spinner-container'; // console.log(L2);

    var l1 = document.createElement('div');
    l1.className = 'preloader-wrapper big active';
    l1.appendChild(spinnerAddColor('blue'));
    l1.appendChild(spinnerAddColor('red'));
    l1.appendChild(spinnerAddColor('yellow'));
    l1.appendChild(spinnerAddColor('green')); // console.log(l1);

    L2.appendChild(l1);
    L1.appendChild(L2);
    document.getElementsByClassName('emergencyMap')[0].appendChild(L1);
  } else {
    document.getElementById('sipnnerEmergency').remove();
  }
};

exports.spinner = spinner;