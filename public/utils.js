function timeSince(date) {
	var seconds = Math.floor((new Date() - date) / 1000);

	var interval = seconds / 31536000;

	if (interval > 1) {
		return Math.floor(interval) + ' ans';
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + ' mois';
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return Math.floor(interval) + ' jours';
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return Math.floor(interval) + ' heures';
	}
	interval = seconds / 60;
	if (interval > 1) {
		return Math.floor(interval) + ' minutes';
	}
	return Math.floor(seconds) + ' secondes';
}
