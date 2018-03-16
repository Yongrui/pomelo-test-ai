var util = require('util');
var EntityType = require('../../consts/consts').EntityType;
var Character = require('./character');
var fightSkill = require('./../fightskill');
var utils = require('../../util/utils');

var Soldier = function (opts) {
	Character.call(this, opts);
	this.type = EntityType.SOLDIER;
	this.totalAttackValue = this.getAttackValue();
	this.totalDefenceValue = this.getDefenceValue();

	this.curSkill = 2;

	this.initFightSkill();
};

util.inherits(Soldier, Character);

module.exports = Soldier;

Soldier.prototype.initFightSkill = function() {
	utils.myPrint('initFightSkill ', this.curSkill);
	if (!this.fightSkills[this.curSkill]) {
		var skill = fightSkill.create({skillId: 2, level: 1, playerId: this.entityId, type: 'remote'});
		this.fightSkills[this.curSkill] = skill;
		utils.myPrint('2 ~ initFightSkill ', skill);
	}
};

Soldier.prototype.toJSON = function() {
	return {
		entityId: this.entityId,
		kindId: this.kindId,
		kindName: this.kindName,
		entityName: this.entityName,
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

Soldier.prototype.toJSON4Attack = function() {
	return {
		entityId: this.entityId,
		x: this.x,
		y: this.y
	};
};