var util = require('util');
var formula = require('../consts/formula');
var consts = require('../consts/consts');

var attack = function(attacker, target, skill) {
	if (attacker.entityId === target.entityId) {
		return {
			result: consts.AttackResult.ERROR
		};
	}

	var damageValue = formula.calcDamage(attacker, target, skill);
	target.hit(attacker, damageValue);

	if (skill.skillId == 1) {
		skill.coolDownTime = 1;
	}

	if (target.died) {
		return {
			result: consts.AttackResult.KILLED,
			damage: damageValue
		};
	} else {
		return {
			result: consts.AttackResult.SUCCESS,
			damage: damageValue
		};
	}
};

var FightSkill = function(opts) {
	this.skillId = opts.skillId;
	this.level = opts.level;
	this.playerId = opts.playerId;
	this.coolDownTime = 0;
};

FightSkill.prototype.judge = function(attacker, target) {
	if (!formula.inRange(attacker, target)) {
		return {
			result: consts.AttackResult.NOT_IN_RANGE,
			distance: attacker.range
		};
	}

	if (this.coolDownTime > Date.now()) {
		return {
			result: consts.AttackResult.NOT_COOLDOWN
		};
	}

	return {
		result: consts.AttackResult.SUCCESS
	};
};;

var AttackSkill = function(opts) {
	FightSkill.call(this, opts);
};

util.inherits(AttackSkill, FightSkill);

AttackSkill.prototype.use = function(attacker, target) {
	var judgeResult = this.judge(attacker, target);
	if (judgeResult.result !== consts.AttackResult.SUCCESS) {
		return judgeResult;
	}
	return attack(attacker, target, this);
};

var CommonAttackSkill = function(opts) {
	AttackSkill.call(this, opts);
};

util.inherits(CommonAttackSkill, AttackSkill);

var create = function(skill) {
	if (skill.type === 'attack'){
		return new AttackSkill(skill);
	}
	throw new Error('error skill type in create skill: ' + skill);
};

module.exports.create = create;
module.exports.FightSkill = FightSkill;
module.exports.AttackSkill = AttackSkill;