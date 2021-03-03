

var mymap = L.map('mapid').setView([46.227638,2.213749], 6);

console.log(mymap);
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png').addTo(mymap);
var control = L.Routing.control({
  waypoints: [
  ],
  router: new L.Routing.osrmv1({
    language: 'fr',
    profile: 'car'
  }),
  geocoder: L.Control.Geocoder.nominatim({})
}).addTo(mymap);
