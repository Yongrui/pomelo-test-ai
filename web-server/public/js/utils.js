function distance (sx, sy, ex, ey) {
	var dx = ex - sx;
	var dy = ey - sy;

	return Math.sqrt(dx * dx + dy * dy);
}

function totalDistance(path) {
	if (!path || path.length < 2) {
		return 0;
	}

	var dist = 0;
	for (var i = 0, l = path.length - 1; i < l; i++) {
		dist += distance(path[i].x, path[i].y, path[i + 1].x, path[i + 1].y);
	}

	return dist;
}