var util = require('util');
var Entity = require('./entity');
var EntityType = require('../../consts/consts').EntityType;

var Player = function (opts) {
	Entity.call(this, opts);
	this.id = opts.id;
	this.type = EntityType.PLAYER;
	this.userId = opts.userId;
	this.name = opts.name;
};

util.inherits(Player, Entity);

module.exports = Player;

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