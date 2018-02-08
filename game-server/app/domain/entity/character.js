var util = require('util');
var utils = require('../../util/utils');
var Entity = require('./entity');
var fightSkill = require('./../fightskill');
var consts = require('../../consts/consts')

var gId = 1;

var Character = function(opts) {
	Entity.call(this, opts);

	this.x = opts.x;
	this.y = opts.y;
	this.died = false;
	this.isMoving = false;
	this.range = opts.range || 0;
	this.hp = opts.hp;
	this.maxHp = opts.maxHp;
	this.orientation = opts.orientation;
	this.attackValue = opts.attackValue;
	this.defenceValue = opts.defenceValue;
	this.totalAttackValue = opts.totalAttackValue || 0;
	this.totalDefenceValue = opts.totalDefenceValue || 0;
	this.walkSpeed = opts.walkSpeed;
	this.attackSpeed = opts.attackSpeed;
	this.attackParam = 1;
	this.defenceParam = 1;
	this.target = null;
	this.attackers = {};
	this.enemies = {};
	this.haters = {};
	this.buffs = [];
	this.curSkill = 1;
	this.fightSkills = {};

	this.initFightSkill();
};

util.inherits(Character, Entity);

module.exports = Character;

Character.prototype.getPosition = function() {
	return {
		x: this.x,
		y: this.y
	};
};

Character.prototype.setPosition = function(x, y) {
	this.x = x;
	this.y = y;
};

Character.prototype.addFightSkills = function(fightSkills) {
	for (var i = 0; i < fightSkills.length; i++) {
		var skill = fightskill.create(fightSkills[i]);
		this.fightSkills[skill.skillId] = skill;
	}
};

Character.prototype.initFightSkill = function() {
	if (!this.fightSkills[this.curSkill]) {
		var skill = fightSkill.create({skillId: 1, level: 1, playerId: this.entityId, type: 'attack'});
		this.fightSkills[this.curSkill] = skill;
	}
};

Character.prototype.setTarget = function(targetId) {
	this.target = targetId;
};

Character.prototype.hasTarget = function() {
	return !!this.target;
};

Character.prototype.clearTarget = function() {
	this.target = null;
};

Character.prototype.move = function(targetX, targetY, cb) {
	var paths = this.arena.map.findPath(this.x, this.y, targetX, targetY);

	if (!!paths) {
		// utils.myPrint('move ', this.entityName, JSON.stringify(paths));
		this.emit('move', {
			character: this,
			paths: paths
		});
		utils.invokeCallback(cb, null, true);
	} else {
		utils.invokeCallback(cb, 'find path error', false);
	}
};

Character.prototype.attack = function(target, skillId) {
	if (this.confused) {
		return {
			result: consts.AttackResult.ATTACKER_CONFUSED
		};
	}

	if (target.died) {
		return {
			result: consts.AttackResult.KILLED
		};
	}

	var skill = this.fightSkills[skillId];
	this.setTarget(target.entityId);
	this.addEnemy(target.entityId);

	// utils.myPrint('attack ', this.x, this.y, target.x, target.y)
	var result = skill.use(this, target);
	this.emit('attack', {
		attacker: this,
		target: target,
		skillId: skillId,
		result: result
	});

	return result;
};

Character.prototype.hit = function(attacker, damage) {
	this.increaseHateFor(attacker.entityId, 5);
	this.reduceHp(damage);
};

Character.prototype.resetHp = function(maxHp) {
	this.maxHp = maxHp;
	this.hp = this.maxHp;
};

Character.prototype.recoverHp = function(hpValue) {
	if (this.hp >= this.maxHp) {
		return;
	}

	var hp = this.hp + hpValue;
	if (hp > this.maxHp) {
		this.hp = this.maxHp;
	} else {
		this.hp = hp;
	}
};

Character.prototype.reduceHp = function(damageValue) {
	this.hp -= damageValue;
	if (this.hp <= 0) {
		this.died = true;
		this.afterDied();
	}
};

Character.prototype.getAttackValue = function() {
	return this.attackValue * this.attackParam;
};

Character.prototype.getDefenceValue = function() {
	return this.defenceValue * this.defenceParam;
};

Character.prototype.getTotalDefence = function() {
	return this.totalDefenceValue;
};

Character.prototype.getTotalAttack = function() {
	return this.totalAttackValue;
};

Character.prototype.afterDied = function() {
	this.emit('died', this);
};

Character.prototype.afterKill = function(target) {
	this.emit('killed', target);
};

Character.prototype.increaseHateFor = function(entityId, points) {
	if (this.haters[entityId]) {
		this.haters[entityId] += points;
	} else {
		this.haters[entityId] = points;
	}
};

Character.prototype.getMostHater = function() {
	var entityId = 0,
		hate = 0;
	for (var id in this.haters) {
		if (this.haters[id] > hate) {
			entityId = id;
			hate = this.haters[id];
		}
	}
	if (entityId <= 0) {
		return null;
	}

	return Number(entityId)
};

Character.prototype.forgetHater = function(entityId) {
	if (this.haters[entityId]) {
		delete this.haters[entityId];
		this.target = this.getMostHater();
	}
};

Character.prototype.forEachHater = function(cb) {
	var hater;
	for (var id in this.haters) {
		hater = this.arena.getEntity(id);
		if (!hater) {
			this.forgetHater(id);
		} else {
			cb(hater)
		}
	}
};

Character.prototype.addEnemy = function(enemyId) {
	this.enemies[enemyId] = 1;
};

Character.prototype.forgetEnemy = function(entityId) {
	delete this.enemies[entityId];
};

Character.prototype.forEachEnemy = function(cb) {
	var enemy;
	for (var enemyId in this.enemies) {
		enemy = this.arena.getEntity(enemyId);
		if (!enemy) {
			this.forgetEnemy(enemyId);
		} else {
			cb(enemy);
		}
	}
};

Character.prototype.isHate = function(entityId) {
	return !!this.haters[entityId];
};

Character.prototype.destroy = function() {
	this.died = true;
	this.haters = {};
	this.clearTarget();
};