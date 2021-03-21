const ORIGIN = {
	lat: 47.115,
	long: 5.2075,
};
const ZOOM_LEVEL = 6;
const TILE_CONFIG = {
	url:
		"https://{s}.tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token={accessToken}",
	attribution: {
		attribution:
			'<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		minZoom: 0,
		maxZoom: 22,
		subdomains: "abcd",
		accessToken:
			"BZBpO3XxRiDzTC6hqzEIGrovMipY4sBTU1G6qSsi2LuUJaSvkAHMvJN3R49jLBns",
	},
};
const DEFAULT_IMAGE =
	"https://grandblancview.mihomepaper.com/wp-content/themes/dolores/assets/img/default.jpg";
const randomDecalage = () => {
	let number = Math.random() * (Math.random() > 0.5 ? 1 : -1);
	return (number * Math.pow(10, -4)) / 2;
};

const arcgisOnline = L.esri.Geocoding.arcgisOnlineProvider({
	countries: ["FR"],
});

const houseIcon = L.icon({
	iconUrl: "./work.png",
	iconSize: [32, 37],
	iconAnchor: [16, 37],
	popupAnchor: [0, -30],
});

let map = null;
let routingControl = null;
let workMarker = null;
let markers = null;
let searchData = null;
const urlParams = new URLSearchParams(window.location.search);

const showMenu = () => {
	const menuButton = $("#showMenu-btn");
	const navButton = $("#sidebar-btn");
	menuButton.hide();
	navButton.parent().addClass("active");
};

const hideMenu = () => {
	const menuButton = $("#showMenu-btn");
	const navButton = $("#sidebar-btn");
	menuButton.show();
	navButton.parent().removeClass("active");
};

const apiUrl = "https://api.fluximmo.com/v1/adverts/search";

let adverts = [];

const clearAdverts = () => {
	markers.clearLayers();
};

const setDefaultImg = (e) => {
	$(e.target).attr("src", DEFAULT_IMAGE);
};

const createCarousel = (images) => {
	const carousel = $('<div class="carousel-inner"></div>');
	const previousBtn = $(
		'<button class="carousel-control-prev" type="button" data-bs-target="#carouselControls" data-bs-slide="prev"><span class="carousel-control-prev-icon" aria-hidden="true"></span><span class="visually-hidden">Previous</span></button>'
	);
	const nextBtn = $(
		'<button class="carousel-control-next" type="button" data-bs-target="#carouselControls" data-bs-slide="next"><span class="carousel-control-next-icon" aria-hidden="true"></span><span class="visually-hidden">Next</span></button>'
	);
	if (images === null) images = [DEFAULT_IMAGE];
	for (let image of images) {
		carousel.append(
			`<div class="carousel-item"><img src="${image}" class="d-block w-100" alt="property_image"></div>`
		);
	}
	carousel.children().eq(0).addClass("active");
	const container = $(
		'<div id="carouselControls" class="carousel slide" data-bs-ride="carousel"></div>'
	)
		.append(carousel)
		.append(previousBtn)
		.append(nextBtn);
	return container;
};

const createInfos = (advertInfos) => {
	const prix = $(`<p>${numberWithSpaces(advertInfos.price)} €</p>`);
	const location = $(`<p>${advertInfos.city} (${advertInfos.postal_code})</p>`);
	const specifics = $(
		`<div class='advert-specifics'><p>${advertInfos.rooms} pieces</p><p>${
			advertInfos.bedrooms != null ? advertInfos.bedrooms : "0"
		} chambres</p><p>${advertInfos.area} m2</p></div>`
	);
	const container = $('<div class="advert-infos"></div>')
		.append(prix)
		.append(location)
		.append(specifics);
	return container;
};

const createAdvertCard = (advert, i) => {
	const topInfos = $(
		`<div class="advert-header"><div><a href="${
			advert.url
		}" target="_blank" rel="noreferrer noopener">${
			advert.website
		}</a></div><p>Il y a ${timeSince(new Date(advert.created_at))}</p></div>`
	);
	const carousel = createCarousel(advert.images_url);
	const infos = createInfos(advert);
	const homeRouting = $(
		`<div style="align-self: center;"> <a id="${i}" class="btn btn-warning advert-routing">Home</a> </div>`
	);
	const main = $('<div class="advert"></div>')
		.append(topInfos)
		.append(carousel)
		.append(infos)
		.append(homeRouting);

	return $("<div></div>").append(main);
};

const initAdverts = () => {
	clearAdverts();
	let i = 0;
	let j = 0;
	let pos = [0, 0];
	for (i in adverts) {
		if (adverts[i].latitude !== null && adverts[i].longitude !== null) {
			L.marker([
				adverts[i].latitude + randomDecalage(),
				adverts[i].longitude + randomDecalage(),
			])
				.bindPopup(createAdvertCard(adverts[i], i).html())
				.addTo(markers);
			pos[0] += adverts[i].latitude;
			pos[1] += adverts[i].longitude;
			j++;
		}
	}
	pos[0] /= j;
	pos[1] /= j;
	map.setView([pos[0], pos[1] + 0.008], 15);
};

const testApi = async () => {
	let resData = {};
	let data = {
		postal_codes: 75002,
		price_max: 500000,
		area_max: 100,
		search_type: "buy",
	};
	let settings = {
		url: apiUrl,
		method: "GET",
		dataType: "json",
		data: data,
		headers: {
			"X-API-KEY": "DUTSTUDENT_pgTrnSMIW7",
		},
	};

	const test = $.ajax(settings).done((res) => {
		adverts = res.adverts;
		console.log(adverts);
		initAdverts();
	});
};

const updateAdverts = (data) => {
	const settings = {
		url: apiUrl,
		method: "GET",
		dataType: "json",
		data: data,
		headers: {
			"X-API-KEY": "DUTSTUDENT_pgTrnSMIW7",
		},
	};
	$.ajax(settings).done((res) => {
		adverts = res.adverts;
		console.log(adverts);
		initAdverts();
		$(".advert-routing").on("click", routeFromHome);
	});
};

const handleFormSubmit = (e) => {
	e.preventDefault();
	const inputs = $(".search-input");
	console.log(inputs);
	data = {};
	types = { search_type: [], property_type: [] };
	inputs.each((i) => {
		const curInput = inputs.eq(i);
		if (curInput.attr("type") === "checkbox") {
			if (curInput[0].checked) types[curInput.val()].push(curInput.attr("id"));
		} else if (curInput.val() !== "")
			data[curInput.attr("id")] = curInput.val();
	});
	if (types.search_type.length === 1)
		data["search_type"] = types.search_type[0];
	if (types.property_type.length === 1)
		data["property_type"] = types.property_type[0];
	searchData = data;
	console.log(searchData);
	updateAdverts(searchData);
};

const routeFromHome = (e) => {
	if (workMarker === null) return;
	if (routingControl !== null) map.removeControl(routingControl);
	const button = $(e.target);
	const id = parseInt(button.attr("id"));
	const curAdvert = adverts[id];

	routingControl = L.Routing.control({
		waypoints: [
			workMarker.getLatLng(),
			L.latLng(curAdvert.latitude, curAdvert.longitude),
		],
	}).addTo(map);
};

const getData = () => {
	let work = null;
	if (workMarker !== null) work = workMarker.getLatLng();
	const data = {
		work: work,
		searchData: searchData,
	};
	return btoa(JSON.stringify(data));
};

const save = (e) => {
	const input = $(e.target).siblings().eq(1);
	const email = input.val();
	const data = getData();
	sendEmail(email, data);
};

const sendEmail = (email, data) => {
	console.log(email, data);
	const settings = {
		url: "http://localhost:3000/sendEmail",
		method: "POST",
		data: { email: email, data: data },
	};
	$.ajax(settings).done((res) => {
		console.log(res);
	});
};

const checkEmail = (e) => {
	if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(e.target.value)) {
		$(e.target).css("color", "green");
		$(e.target).siblings().eq(1).prop("disabled", false);
	} else {
		$(e.target).css("color", "red");
		$(e.target).siblings().eq(1).prop("disabled", true);
	}
};

const loadSave = (layer) => {
	let data = urlParams.get("save");
	data = JSON.parse(atob(data));
	console.log(data);
	if (data.work !== null) {
		workMarker = L.marker([data.work.lat, data.work.lng], { icon: houseIcon });
		setWorkMarker(layer, workMarker);
	}
	if (data.searchData !== null) {
		updateAdverts(data.searchData);
		for (let field in data.searchData){
			$(`#${field}`).val(data.searchData[field]);
		}
		
		if (data.searchData.property_type) {
			const inputs = $('.propertyType-check')
			inputs.each((i) => {inputs[i].checked = false;})
			$(`#${data.searchData.property_type}`)[0].checked = true;
		}
		if (data.searchData.search_type) {
			const inputs = $('.searchType-check')
			inputs.each((i) => {inputs[i].checked = false;})
			$(`#${data.searchData.search_type}`)[0].checked = true;
		}
	}
}

const setWorkMarker = (layer, marker) => {
	layer.clearLayers();
	layer.addLayer(marker);
}

$(document).ready(() => {
	map = L.map("mapid").setView([ORIGIN.lat, ORIGIN.long], ZOOM_LEVEL);
	const tiles = L.tileLayer(TILE_CONFIG.url, TILE_CONFIG.attribution).addTo(
		map
	);
	markers = L.layerGroup().addTo(map);

	let searchControl = L.esri.Geocoding.geosearch({
		providers: [arcgisOnline],
	}).addTo(map);
	
	let workLayer = L.layerGroup().addTo(map);

	searchControl.on("results", (data) => {
		workLayer.clearLayers();
		workMarker = L.marker(data.results[0].latlng, { icon: houseIcon });
		setWorkMarker(workLayer, workMarker);
	});

	map.on("popupopen", (e) => {
		$(".advert-routing").on("click", routeFromHome);
	});

	$("#center-me").on("click", testApi);

	$("#showMenu-btn").on("click", showMenu);
	$("#sidebar-btn").on("click", hideMenu);

	$("#postal_codes").on("change", (e) => {
		if (validPostalCode(parseInt(e.target.value, 10)))
			$(e.target).css("color", "green");
		else $(e.target).css("color", "red");
	});

	$("#criteres-form").on("submit", handleFormSubmit);
	$("#email").on("input", checkEmail);
	$("#save-btn").on("click", save);
	if (urlParams.has("save")) loadSave(workLayer);
});
