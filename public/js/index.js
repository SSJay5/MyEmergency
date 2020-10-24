import '@babel/polyfill';
// import { Linter } from 'eslint';
import { displayMap } from './mapbox';
// import anime from 'animejs';
import { emergencyButtonAction } from './buttonAction';

document.addEventListener('DOMContentLoaded', function () {
  var myNav = document.querySelectorAll('.sidenav');
  M.Sidenav.init(myNav, {});
});
var collapsibleElem = document.querySelector('.collapsible');
var collapsibleInstance = M.Collapsible.init(collapsibleElem, options);

let locations = [72.82119, 18.959125];
displayMap(locations);
const refreshButton = document.getElementsByClassName('btn-refresh')[0];
refreshButton.addEventListener('click', (f) => {
  navigator.geolocation.getCurrentPosition(
    (data) => {
      locations[0] = data.coords.longitude;
      locations[1] = data.coords.latitude;
      displayMap(locations);
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: false,
    }
  );
});
var emergencyButton = document.getElementsByClassName('btn-emergency')[0];

if (emergencyButton) {
  emergencyButton.addEventListener('click', (f) => {
    emergencyButton.style.animationName = 'scaleDown';
    emergencyButton.style.animationDuration = '1s';
  });
}
