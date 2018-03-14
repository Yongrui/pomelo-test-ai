var Action = require('./action');
var util = require('util');
var utils = require('../../util/utils');

var Move = function(opts) {
	opts.type = 'move';
	opts.id = opts.entity.entityId;
	opts.singleton = true;

	Action.call(this, opts);
	this.entity = opts.entity;
	this.area = this.entity.area;
	this.path = opts.path;
	this.speed = Number(opts.speed);
	this.time = Date.now();
	this.pos = this.path[0];
	this.index = 1;
	this.tickNumber = 0;
	this.entity.isMoving = true;
};

util.inherits(Move, Action);

Move.prototype.update = function() {
	this.tickNumber++;
	var time = Date.now() - this.time;
	var speed = this.speed;

	var path = this.path;
	var index = this.index;
	var travelDistance = speed * time / 1000;
	var oldPos = {
		x: this.pos.x,
		y: this.pos.y
	};
	var pos = oldPos;
	var dest = path[index];
	var distance = getDis(this.pos, dest);

	while (travelDistance > 0) {
		if (distance <= travelDistance) {
			travelDistance = travelDistance - distance;
			pos = path[index];
			index++;

			if (index >= path.length) {
				this.finished = true;
				this.entity.isMoving = false;
				break;
			}

			dest = path[index];
			distance = getDis(pos, dest);
		} else {
			distance = distance - travelDistance;
			pos = getPos(pos, dest, distance);
			travelDistance = 0;
		}
	}

	this.pos = pos;
	this.index = index;

	this.entity.x = Math.floor(pos.x);
	this.entity.y = Math.floor(pos.y);

	this.time = Date.now();
};

function getDis(pos1, pos2) {
	return Math.sqrt(Math.pow((pos1.x - pos2.x), 2) + Math.pow((pos1.y - pos2.y), 2));
}

function getPos(start, end, dis) {
	var length = getDis(start, end);
	var pos = {};

	pos.x = end.x - (end.x - start.x) * (dis / length);
	pos.y = end.y - (end.y - start.y) * (dis / length);

	return pos;
}

module.exports = Move;