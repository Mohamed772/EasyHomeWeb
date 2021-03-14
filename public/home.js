const ORIGIN = {
	lat: 47.115,
	long: 5.2075,
};
const ZOOM_LEVEL = 6;
const TILE_CONFIG = {
	url:
		'https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}',
	attribution: {
		attribution:
			'<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: 0,
		maxZoom: 22,
		subdomains: 'abcd',
		accessToken:
			'BZBpO3XxRiDzTC6hqzEIGrovMipY4sBTU1G6qSsi2LuUJaSvkAHMvJN3R49jLBns',
	},
};

const showMenu = () => {
	const menuButton = $('#showMenu-btn');
	const navButton = $('#sidebar-btn');
	menuButton.hide();
	navButton.parent().addClass('active');
};

const hideMenu = () => {
	const menuButton = $('#showMenu-btn');
	const navButton = $('#sidebar-btn');
	menuButton.show();
	navButton.parent().removeClass('active');
};

const apiUrl = 'https://api.fluximmo.com/v1/adverts/search';

const testApi = () => {
	let data = {
		postal_codes: 75019,
		price_max: 500000,
		area_max: 100,
		search_type: 'buy',
		limit: 4,
		property_type: 'Apartment',
	};
	let settings = {
		url: apiUrl,
		method: 'GET',
		dataType: 'json',
		data: data,
		headers: {
			'X-API-KEY': 'DUTSTUDENT_pgTrnSMIW7',
		},
	};

	$.ajax(settings).done((res) => {
		console.log(res);
	});
};

$(document).ready(() => {
	let map = L.map('mapid').setView([ORIGIN.lat, ORIGIN.long], ZOOM_LEVEL);
	const tiles = L.tileLayer(TILE_CONFIG.url, TILE_CONFIG.attribution).addTo(
		map
	);

	const getLocation = () => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(showPosition);
			navigator.geolocation.getCurrentPosition(console.log);
		} else $('#text').text('Geolocation non supportée par ce navigateur.');
	};

	const showPosition = (position) => {
		map.setView([position.coords.latitude, position.coords.longitude], 13);
		let moi = L.marker([
			position.coords.latitude,
			position.coords.longitude,
		])
			.bindPopup("<b>C'EST moi !</b><br>")
			.openPopup();
		moi.addTo(map);
		$('#text').html(
			'Latitude: ' +
				position.coords.latitude +
				'<br/>Longitude: ' +
				position.coords.longitude +
				'<br/>Plus ou moins ' +
				position.coords.accuracy +
				' mètres.'
		);
	};

	$('#center-me').on('click', (e) => {
		e.preventDefault();
		getLocation();
	});

	$('#showMenu-btn').on('click', showMenu);
	$('#sidebar-btn').on('click', hideMenu);
	// testApi();
});
