const { JSDOM } = require("jsdom");
const { window } = new JSDOM("");
const $ = require("jquery")(window);

$(document).ready(() => {
	var mymap = L.map("mapid").setView([46.227638, 2.213749], 6);
	var p = document.getElementById("demo");

	console.log(mymap);
	L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png").addTo(mymap);
	var control = L.Routing.control({
		waypoints: [],
		router: new L.Routing.osrmv1({
			language: "fr",
			profile: "car",
		}),
		geocoder: L.Control.Geocoder.nominatim({}),
	}).addTo(mymap);

	function getLocation() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
		} else {
			p.innerHTML = "Geolocation non supportée par ce navigateur.";
		}
	}

	function showPosition(position) {
		mymap.setView([position.coords.latitude, position.coords.longitude], 15);
		var Moi = L.marker([position.coords.latitude, position.coords.longitude])
			.bindPopup("<b>C'EST MOI !</b><br>")
			.openPopup();
		Moi.addTo(mymap);
		const geocoder = L.Control.Geocoder.nominatim({});
		var result;
		geocoder.reverse(Location, 1, result);
		console.log(result);
		p.innerHTML = "Latitude: " + position.coords.latitude;
		p.innerHTML += "<br/>Longitude: " + position.coords.longitude;
		p.innerHTML += "Plus ou Moins " + position.coords.accuracy + " mètres.";
		//console.log("Plus ou Moins " + position.coords.accuracy + " mètres.");
	}

	const apitest = () => {
		data = {
			postal_codes: "75019",
			price_max: 500000,
			area_max: 100,
			limit: 4,
		};

		$.get(
			"demo_test.txt",
			data,
			(result) => {
				console.log(result);
			},
			"json"
		);
	};
});
