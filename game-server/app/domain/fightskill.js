var util = require('util');
var formula = require('../consts/formula');
var consts = require('../consts/consts');
var Bullet = require('./entity/bullet');
var utils = require('../util/utils');

var attack = function(attacker, target, skill) {
	if (attacker.entityId === target.entityId) {
		return {
			result: consts.AttackResult.ERROR
		};
	}

	var damageValue = formula.calcDamage(attacker, target, skill);
	target.hit(attacker, damageValue);

	if (skill.skillId == 1) {
		var cooltime = 1;
		skill.coolDownTime = Date.now() + Number(cooltime / attacker.attackSpeed * 1000);
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

var remoteAttack = function(attacker, target, skill) {
	if (attacker.entityId === target.entityId) {
		return {
			result: consts.AttackResult.ERROR
		};
	}

	var damageValue = formula.calcDamage(attacker, target, skill);

	var arena = attacker.arena;
	var bullet = new Bullet({
		attacker: attacker.entityId,
		target: target.entityId,
		speed: 100,
		x: attacker.x,
		y: attacker.y,
		damage: damageValue
	});
	arena.addEntity(bullet);

	if (skill.skillId == 2) {
		var cooltime = 1;
		skill.coolDownTime = Date.now() + Number(cooltime / attacker.attackSpeed * 1000);
	}

	return {
		result: consts.AttackResult.SUCCESS,
		damage: 0
	};
}

var FightSkill = function(opts) {
	this.skillId = opts.skillId;
	this.level = opts.level;
	this.playerId = opts.playerId;
	this.coolDownTime = 0;
	this.skillData = {};
};

FightSkill.prototype.judge = function(attacker, target) {
	var range = attacker.range + attacker.attackRange + target.range
	utils.myPrint('judge ', attacker.range, attacker.attackRange, target.range, range);
	if (!formula.inRange(attacker, target, range)) {
		return {
			result: consts.AttackResult.NOT_IN_RANGE,
			distance: range
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
};

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

var RemoteAttackSkill = function(opts) {
	FightSkill.call(this, opts);
}

util.inherits(RemoteAttackSkill, FightSkill);

RemoteAttackSkill.prototype.use = function(attacker, target) {
	var judgeResult = this.judge(attacker, target);
	if (judgeResult.result !== consts.AttackResult.SUCCESS) {
		return judgeResult;
	}
	return remoteAttack(attacker, target, this);
};

var create = function(skill) {
	if (skill.type === 'attack'){
		return new AttackSkill(skill);
	}
	else if (skill.type === 'remote') {
		return new RemoteAttackSkill(skill);
	}
	throw new Error('error skill type in create skill: ' + skill);
};

module.exports.create = create;
module.exports.FightSkill = FightSkill;
module.exports.AttackSkill = AttackSkill;