var util = require('util');
var EntityType = require('../../consts/consts').EntityType;
var Character = require('./character');

var Soldier = function (opts) {
	Character.call(this, opts);
	this.type = EntityType.SOLDIER;
	this.totalAttackValue = this.getAttackValue();
	this.totalDefenceValue = this.getDefenceValue();
};

util.inherits(Soldier, Character);

module.exports = Soldier;

Soldier.prototype.toJSON = function() {
	return {
		entityId: this.entityId,
		x: this.x,
		y: this.y,
		hp: this.hp,
		maxHp: this.maxHp,
		type: this.type,
		camp: this.camp,
		level: this.level,
		walkSpeed: this.walkSpeed
	};
};