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
let map;

let markers;

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

const createAdvertCard = (advert) => {
	const topInfos = $(
		`<div class="advert-header"><div><a href="${
			advert.url
		}" target="_blank" rel="noreferrer noopener">${
			advert.website
		}</a></div><p>Il y a ${timeSince(new Date(advert.created_at))}</p></div>`
	);
	const carousel = createCarousel(advert.images_url);
	const infos = createInfos(advert);
	const main = $('<div class="advert"></div>')
		.append(topInfos)
		.append(carousel)
		.append(infos);

	return $("<div></div>").append(main);
};

const initAdverts = () => {
	clearAdverts();
	let i = 0;
	let pos = [0, 0];
	for (let advert of adverts) {
		if (advert.latitude !== null && advert.longitude !== null) {
			L.marker([
				advert.latitude + randomDecalage(),
				advert.longitude + randomDecalage(),
			])
				.bindPopup(createAdvertCard(advert).html())
				.addTo(markers);
			pos[0] += advert.latitude;
			pos[1] += advert.longitude;
			i++;
		}
	}
	pos[0] /= i;
	pos[1] /= i;
	map.setView([pos[0], pos[1]], 15);
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
	});
};

const handleFormSubmit = (e) => {
	e.preventDefault();
	const inputs = $("input");
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
	console.log(data);
	updateAdverts(data);
};

$(document).ready(() => {
	map = L.map("mapid").setView([ORIGIN.lat, ORIGIN.long], ZOOM_LEVEL);
	const tiles = L.tileLayer(TILE_CONFIG.url, TILE_CONFIG.attribution).addTo(
		map
	);
	markers = L.layerGroup().addTo(map);

	$("#center-me").on("click", testApi);

	$("#showMenu-btn").on("click", showMenu);
	$("#sidebar-btn").on("click", hideMenu);

	$("#criteres-form").on("submit", handleFormSubmit);
});
