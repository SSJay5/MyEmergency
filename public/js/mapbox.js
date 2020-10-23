// import 'https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.js';

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoiamF5c3M1IiwiYSI6ImNrZGh1eGRwOTMwaDYzNGs2bjFld3RhM2MifQ.-vUZBda_lIdiQMUHSLUGdg';

  var map = new mapboxgl.Map({
    container: 'map', // container id
    style: 'mapbox://styles/jayss5/ckgkhc0js0tlh19nx8qw40cgf',
    scrollZoom: false,
    center: locations,
    zoom: 16,
  });
  // var geolocate = new mapboxgl.GeolocateControl({
  //   positionOptions: {
  //     enableHighAccuracy: true,
  //   },
  //   trackUserLocation: true,
  // });
  // // Add the control to the map.
  // map.addControl(geolocate);
  // // Set an event listener that fires
  // // when a geolocate event occurs.
  // geolocate.on('geolocate', function () {
  //   console.log('A geolocate event has occurred.');
  // });
  // geolocate.trigger();
  // Create marker
  document.querySelectorAll('.pulse').forEach((e) => e.remove());
  document.querySelectorAll('.marker').forEach((e) => e.remove());
  
  var el1 = document.createElement('div');
  el1.className = 'btn-floating pulse';

  const el2 = document.createElement('div');
  el2.className = 'marker';

  // Add marker
  var myMarker2 = new mapboxgl.Marker({
    element: el2,
    anchor: 'bottom',
  })
    .setLngLat(locations)
    .addTo(map);
  var myMarker1 = new mapboxgl.Marker({
    element: el1,
    anchor: 'bottom',
  })
    .setLngLat(locations)
    .addTo(map);

  // Add popup
  new mapboxgl.Popup({
    offset: 30,
  })
    .setLngLat(locations)
    .setHTML(`<p>Your Current Location</p>`)
    .addTo(map);
};
