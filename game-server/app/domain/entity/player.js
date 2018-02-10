var util = require('util');
var Entity = require('./entity');
var consts = require('../../consts/consts');
var EntityType = require('../../consts/consts').EntityType;

var Player = function(opts) {
	Entity.call(this, opts);
	this.id = opts.id;
	this.type = EntityType.PLAYER;
	this.userId = opts.userId;
	this.name = opts.name;
	this.arenaId = consts.ARENA.ARENA_ID_NONE;
};

util.inherits(Player, Entity);

module.exports = Player;

Player.prototype.enterArena = function(arenaId) {
	if (!arenaId || arenaId === consts.ARENA.ARENA_ID_NONE) {
		return false;
	}
	this.arenaId = arenaId;
	return true;
};

Player.prototype.leaveArena = function() {
	if (this.arenaId  === consts.ARENA.ARENA_ID_NONE) {
		return false;
	}
	this.arenaId =  consts.ARENA.ARENA_ID_NONE;
	return true;
};

Player.prototype.isInArena = function() {
	return (this.arenaId !== consts.ARENA.ARENA_ID_NONE);
};

Player.prototype.toJSON = function() {
	return {
		id: this.id,
		entityId: this.entityId,
		name: this.name,
		type: this.type,
		userId: this.userId,
		camp: this.camp
	};
};