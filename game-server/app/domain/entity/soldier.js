var util = require('util');
var EntityType = require('../../consts/consts').EntityType;
var Character = require('./character');
var fightSkill = require('./../fightskill');

var Soldier = function (opts) {
	Character.call(this, opts);
	this.type = EntityType.SOLDIER;
	this.totalAttackValue = this.getAttackValue();
	this.totalDefenceValue = this.getDefenceValue();

	this.initFightSkill();
};

util.inherits(Soldier, Character);

module.exports = Soldier;

Soldier.prototype.initFightSkill = function() {
	if (!this.fightSkills[this.curSkill]) {
		var skill = fightSkill.create({skillId: 1, level: 1, playerId: this.entityId, type: 'attack'});
		this.fightSkills[this.curSkill] = skill;
	}
};

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