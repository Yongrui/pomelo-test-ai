var util = require('util');
var Entity = require('./entity');
var EntityType = require('../../consts/consts').EntityType;
var utils = require('../../util/utils');

var Bullet = function(opts) {
	Entity.call(this, opts);
	this.type = EntityType.BULLET;
	this.x = opts.x;
	this.y = opts.y;
	this.speed = opts.speed;
	this.attackerId = opts.attacker;
	this.targetId = opts.target;
	this.damage = opts.damage;
	this.died = false;
	this.isMoving = false;
};

util.inherits(Bullet, Entity);

module.exports = Bullet;

Bullet.prototype.fire = function() {
	if (!this.arena) {
		return;
	}

	var attacker = this.arena.getEntity(this.attackerId);
	var target = this.arena.getEntity(this.targetId);
	if (!attacker || !target) {
		return;
	}

	this.destX = target.x;
	this.destY = target.y;
	var paths = [{x: attacker.x, y: attacker.y}, {x: target.x, y: target.y}];
	// this.emit('fire', {bullet: this, paths: paths});
};

Bullet.prototype.update = function() {
	var target = this.arena.getEntity(this.targetId);
	if (!target) {
		return;
	}

	if (!this.isMoving) {
		var attacker = this.arena.getEntity(this.attackerId);
		target.hit(attacker, this.damage);
		this.died = true;
		return;
	}

	// if (this.destX !== target.x || this.destY !== target.y) {
	// 	this.destX = target.x;
	// 	this.destY = target.y;
	// 	var paths = [{x: this.x, y: this.y}, {x: target.x, y: target.y}];
	// 	this.emit('fire', {bullet: this, paths: paths});
	// }
};

Bullet.prototype.toJSON = function() {
	return {
		id: this.entityId,
		kindId: this.kindId,
		x: this.x,
		y: this.y,
		speed: this.speed,
		type: this.type
	};
};