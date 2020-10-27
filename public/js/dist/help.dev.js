"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.help = void 0;

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* eslint-disable */
var help = function help(helpingLocation, Location) {
  var option,
      coordinates,
      requestURL,
      res,
      map,
      el1,
      el2,
      myMarker2,
      myMarker1,
      myMarker3,
      _args = arguments;
  return regeneratorRuntime.async(function help$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          option = _args.length > 2 && _args[2] !== undefined ? _args[2] : 'driving';
          coordinates = [];
          mapboxgl.accessToken = 'pk.eyJ1IjoiamF5c3M1IiwiYSI6ImNrZGh1eGRwOTMwaDYzNGs2bjFld3RhM2MifQ.-vUZBda_lIdiQMUHSLUGdg';
          requestURL = "https://api.mapbox.com/directions/v5/mapbox/".concat(option, "/").concat(helpingLocation[0], ",").concat(helpingLocation[1], ";").concat(Location[0], ",").concat(Location[1], "?geometries=geojson&access_token=").concat(mapboxgl.accessToken);
          _context.prev = 4;
          _context.next = 7;
          return regeneratorRuntime.awrap((0, _axios["default"])({
            method: 'GET',
            url: requestURL
          }));

        case 7:
          res = _context.sent;
          coordinates = res.routes[0].geometry.coordinates;
          _context.next = 14;
          break;

        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](4);
          alert('error', _context.t0.response.data.message);

        case 14:
          map = new mapboxgl.Map({
            container: 'map',
            // container id
            style: 'mapbox://styles/jayss5/ckgkhc0js0tlh19nx8qw40cgf',
            scrollZoom: false,
            center: coordinates[coordinates.length / 2],
            zoom: 16
          });
          el1 = document.createElement('div');
          el1.className = 'btn-floating pulse';
          el2 = document.createElement('div');
          el2.className = 'marker'; // Add marker

          myMarker2 = new mapboxgl.Marker({
            element: el2,
            anchor: 'bottom'
          }).setLngLat(Location).addTo(map);
          myMarker1 = new mapboxgl.Marker({
            element: el1,
            anchor: 'bottom'
          }).setLngLat(Location).addTo(map);
          myMarker3 = new mapboxgl.Marker({
            element: el2,
            anchor: 'bottom'
          }).setLngLat(helpingLocation).addTo(map); // Add popup

          new mapboxgl.Popup({
            offset: 30
          }).setLngLat(helpingLocation).setHTML("<p>Your Current Location</p>").addTo(map);
          map.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: coordinates
              }
            }
          });
          map.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#888',
              'line-width': 8
            }
          });

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[4, 11]]);
};

exports.help = help;