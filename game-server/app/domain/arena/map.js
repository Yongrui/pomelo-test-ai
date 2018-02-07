var buildFinder = require('pomelo-pathfinding').buildFinder;
var formula = require('../../consts/formula');

var Map = function(opts) {
	this.width = 2200;
	this.height = 840;
	this.tileW = 20;
	this.tileH = 20;
	this.rectW = Math.ceil(this.width / this.tileW);
	this.rectH = Math.ceil(this.height / this.tileH);

	var i, j;
	this.weightMap = [];
	for (i = 0; i < this.rectW; i++) {
		this.weightMap[i] = [];
		for (j = 0; j < this.rectH; j++) {
			this.weightMap[i][j] = 1;
		}
	}

	this.pfinder = buildFinder(this);
};

module.exports = Map;

Map.prototype.forAllReachable = function(x, y, processReachable) {
	// var x1 = x - 1,
	// 	x2 = x + 1;
	// var y1 = y - 1,
	// 	y2 = y + 1;

	// x1 = x1 < 0 ? 0 : x1;
	// y1 = y1 < 0 ? 0 : y1;
	// x2 = x2 >= this.rectW ? (this.rectW - 1) : x2;
	// y2 = y2 >= this.rectH ? (this.rectH - 1) : y2;

	if (y > 0) {
		processReachable(x, y - 1, this.weightMap[x][y - 1]);
	}
	if ((y + 1) < this.rectH) {
		processReachable(x, y + 1, this.weightMap[x][y + 1]);
	}
	if (x > 0) {
		processReachable(x - 1, y, this.weightMap[x - 1][y]);
	}
	if ((x + 1) < this.rectW) {
		processReachable(x + 1, y, this.weightMap[x + 1][y]);
	}
	// if (x > 0 && y > 0) {
	// 	processReachable(x - 1, y - 1, this.weightMap[x - 1][y - 1]);
	// }
	// if (x > 0 && (y + 1) < this.rectH) {
	// 	processReachable(x - 1, y + 1, this.weightMap[x - 1][y + 1]);
	// }
	// if ((x + 1) < this.rectW && (y + 1) < this.rectH) {
	// 	processReachable(x + 1, y + 1, this.weightMap[x + 1][y + 1]);
	// }
	// if ((x + 1) < this.rectW && y > 0) {
	// 	processReachable(x + 1, y - 1, this.weightMap[x + 1][y - 1]);
	// }
};

Map.prototype.getWeight = function(x, y) {
	return this.weightMap[x][y];
};

Map.prototype.isReachable = function(x, y) {
	if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
		return false;
	}

	var tx = Math.floor(x / this.tileW);
	var ty = Math.floor(y / this.tileH);
	if (!this.weightMap[tx] || !this.weightMap[tx][ty]) {
		return false;
	}

	return this.weightMap[tx][ty] === 1;
};

Map.prototype.findPath = function(x, y, x1, y1) {
	if (x < 0 || x > this.width || y < 0 || y > this.height || x1 < 0 || x1 > this.width || y1 < 0 || y1 > this.height) {
		return null;
	}

	if (!this.isReachable(x, y)) {
		return null;
	}

	if (!this.isReachable(x1, y1)) {
		return null;
	}

	if (this._checkLinePath(x, y, x1, y1)) {
		return [{
			x: x,
			y: y
		}, {
			x: x1,
			y: y1
		}];
	}

	var tx1 = Math.floor(x / this.tileW);
	var ty1 = Math.floor(y / this.tileH);
	var tx2 = Math.floor(x1 / this.tileW);
	var ty2 = Math.floor(y1 / this.tileH);

	var path = this.pfinder(tx1, ty1, tx2, ty2);
	if (!path || !path.paths) {
		return null;
	}

	var paths = [];
	for (var i = 0; i < path.paths.length; i++) {
		paths.push(transPos(path.paths[i], this.tileW, this.tileH));
	}

	paths = this.compressPath2(paths);
	if (paths.length > 2) {
		paths = this.compressPath1(paths, 3);
		paths = this.compressPath2(paths);
	}

	return paths;
};

Map.prototype.compressPath2 = function(tilePath) {
	var oldPos = tilePath[0];
	var path = [oldPos];

	for (var i = 1; i < (tilePath.length - 1); i++) {
		var pos = tilePath[i];
		var nextPos = tilePath[i + 1];

		if (!isLine(oldPos, pos, nextPos)) {
			path.push(pos);
		}

		oldPos = pos;
		pos = nextPos;
	}

	path.push(tilePath[tilePath.length - 1]);
	return path;
};

Map.prototype.compressPath1 = function(path, loopTime) {
	var newPath;

	for (var k = 0; k < loopTime; k++) {
		var start;
		var end;
		newPath = [path[0]];

		for (var i = 0, j = 2; j < path.length;) {
			start = path[i];
			end = path[j];
			if (this._checkLinePath(start.x, start.y, end.x, end.y)) {
				newPath.push(end);
				i = j;
				j += 2;
			} else {
				newPath.push(path[i + 1]);
				i++;
				j++;
			}

			if (j >= path.length) {
				if ((i + 2) === path.length) {
					newPath.push(path[i + 1]);
				}
			}
		}
		path = newPath;
	}

	return newPath;
};

Map.prototype._checkLinePath = function(x1, y1, x2, y2) {
	var px = x2 - x1;
	var py = y2 - y1;
	var tile = this.tileW / 2;
	if (px === 0) {
		while (x1 < x2) {
			x1 += tile;
			if (!this.isReachable(x1, y1)) {
				return false;
			}
		}
		return true;
	}

	if (py === 0) {
		while (y1 < y2) {
			y1 += tile;
			if (!this.isReachable(x1, y1)) {
				return false;
			}
		}
		return true;
	}

	var dis = formula.distance(x1, y1, x2, y2);
	var rx = (x2 - x1) / dis;
	var ry = (y2 - y1) / dis;
	var dx = tile * rx;
	var dy = tile * ry;

	var x0 = x1;
	var y0 = y1;
	x1 += dx;
	y1 += dy;

	while ((dx > 0 && x1 < x2) || (dx < 0 && x1 > x2)) {
		if (!this._testLine(x0, y0, x1, y1)) {
			return false;
		}

		x0 = x1;
		y0 = y1;
		x1 += dx;
		y1 += dy;
	}
	return true;
};

Map.prototype._testLine = function(x, y, x1, y1) {
	if (!this.isReachable(x, y) || !this.isReachable(x1, y1)) {
		return false;
	}

	var dx = x1 - x;
	var dy = y1 - y;

	var tileX = Math.floor(x / this.tileW);
	var tileY = Math.floor(y / this.tileW);
	var tileX1 = Math.floor(x1 / this.tileW);
	var tileY1 = Math.floor(y1 / this.tileW);

	if (tileX === tileX1 || tileY === tileY1) {
		return true;
	}

	var minY = y < y1 ? y : y1;
	var maxTileY = (tileY > tileY1 ? tileY : tileY1) * this.tileW;

	if ((maxTileY - minY) === 0) {
		return true;
	}

	var y0 = maxTileY;
	var x0 = x + dx / dy * (y0 - y);

	var maxTileX = (tileX > tileX1 ? tileX : tileX1) * this.tileW;

	var x3 = (x0 + maxTileX) / 2;
	var y3 = y + dy / dx * (x3 - x);

	if (this.isReachable(x3, y3)) {
		return true;
	}
	return false;
};

function transPos(pos, tileW, tileH) {
	var newPos = {};
	newPos.x = pos.x * tileW + tileW / 2;
	newPos.y = pos.y * tileH + tileH / 2;

	return newPos;
}

function isLine(p0, p1, p2) {
	return ((p1.x - p0.x) === (p2.x - p1.x)) && ((p1.y - p0.y) === (p2.y - p1.y));
}