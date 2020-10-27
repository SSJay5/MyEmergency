/* eslint-disable */

import axios from 'axios';

export const help = async (helpingLocation, Location, option = 'driving') => {
  let coordinates = [];
  mapboxgl.accessToken =
    'pk.eyJ1IjoiamF5c3M1IiwiYSI6ImNrZGh1eGRwOTMwaDYzNGs2bjFld3RhM2MifQ.-vUZBda_lIdiQMUHSLUGdg';

  let requestURL = `https://api.mapbox.com/directions/v5/mapbox/${option}/${helpingLocation[0]},${helpingLocation[1]};${Location[0]},${Location[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;

  try {
    const res = await axios({
      method: 'GET',
      url: requestURL,
    });
    coordinates = res.routes[0].geometry.coordinates;
  } catch (err) {
    alert('error', err.response.data.message);
  }

  var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/jayss5/ckgkhc0js0tlh19nx8qw40cgf',
    scrollZoom: false,
    center: coordinates[coordinates.length / 2],
    zoom: 16,
  });

  const el1 = document.createElement('div');
  el1.className = 'btn-floating pulse';

  const el2 = document.createElement('div');
  el2.className = 'marker';

  // Add marker
  var myMarker2 = new mapboxgl.Marker({
    element: el2,
    anchor: 'bottom',
  })
    .setLngLat(Location)
    .addTo(map);
  var myMarker1 = new mapboxgl.Marker({
    element: el1,
    anchor: 'bottom',
  })
    .setLngLat(Location)
    .addTo(map);

  var myMarker3 = new mapboxgl.Marker({
    element: el2,
    anchor: 'bottom',
  })
    .setLngLat(helpingLocation)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(helpingLocation)
    .setHTML(`<p>Your Current Location</p>`)
    .addTo(map);

  map.addSource('route', {
    type: 'geojson',
    data: {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: coordinates,
      },
    },
  });
  map.addLayer({
    id: 'route',
    type: 'line',
    source: 'route',
    layout: {
      'line-join': 'round',
      'line-cap': 'round',
    },
    paint: {
      'line-color': '#888',
      'line-width': 8,
    },
  });
};
