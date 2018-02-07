var consts = require('../../consts/consts');
var pomelo = require('pomelo');
var utils = require('../../util/utils');
var ai = require('../../ai/ai');
var ActionManager = require('./../action/actionManager');
var eventManager = require('./../event/eventManager');
var channelUtil = require('../../util/channelUtil');
var Timer = require('./timer');

function Arena (opts) {
	this.arenaId = opts.arenaId;
	this.map = opts.map;

	this.players = {};
	this.watchers = {};
	this.entities = {};
	this.channel = null;

	this.aiManager = ai.createManager({arena: this});
	this.actionManager = new ActionManager();

	this.timer = new Timer({
		arena: this,
		interval: 100
	});
};

Arena.prototype.start = function() {
	this.aiManager.start();
	this.timer.run();
};

Arena.prototype.close = function() {
	this.timer.close();
};

Arena.prototype.createChannel = function() {
	if (this.channel) {
		return this.channel;
	}

	var channelName = channelUtil.getArenaChannelName(this.arenaId);
	this.channel = pomelo.app.get('channelService').getChannel(channelName, true);
};

Arena.prototype.addPlayer2Channel = function(data) {
	if (!this.channel) {
		return false;
	}

	if (!!data) {
		utils.myPrint('addPlayer2Channel ', data.userId, data.serverId);
		this.channel.add(data.userId, data.serverId);
		return true;
	}

	return false;
};

Arena.prototype.removePlayerFromChannel = function(data) {
	if (!this.channel) {
		return false;
	}

	if (!!data) {
		this.channel.leave(data.userId, data.serverId);
		return true;
	}

	return false;
};

Arena.prototype.pushMsg2All = function(route, content) {
	if (!this.channel) {
		return false;
	}

	this.channel.pushMessage(route, content, null);
	return true;
};

Arena.prototype.addEntity = function(e) {
	var entities = this.entities;
	if (!e || !e.entityId) {
		return false;
	}

	e.arena = this;

	entities[e.entityId] = e;

	var enemies = this.getEnemyCampEntities(e);
	for (var id in enemies) {
		e.increaseHateFor(id, 5);
		enemies[id].increaseHateFor(e.entityId, 5);
	}

	eventManager.addEvent(e);
	this.aiManager.addCharacters([e]);
	return true;
};

Arena.prototype.removeEntity = function(entityId) {
	var entities = this.entities;

	var e = entities[entityId];
	if (!e) return true;

	this.aiManager.removeCharacter(e.entityId);
	this.actionManager.abortAllAction(entityId);

	e.forEachEnemy(function (enemy) {
		enemy.forgetHater(e.entityId);
	});

	e.forEachHater(function (hater) {
		hater.forgetEnemy(e.entityId);
	});

	delete entities[entityId];
};

Arena.prototype.getEntity = function(entityId) {
	var entity = this.entities[entityId];
	if (!entity) {
		return null;
	}
	return entity;
};

Arena.prototype.getAllEntities = function() {
	return this.entities;
};

Arena.prototype.getCampEntities = function(camp) {
	var result = {};
	var entities = this.entities;

	for (var id in entities) {
		if (entities[id].camp === camp) {
			result[id] = entities[id]
		}
	}

	return result;
};

Arena.prototype.getWeCampEntities = function(e) {
	return this.getCampEntities(e.camp);
};

Arena.prototype.getEnemyCampEntities = function(e) {
	if (e.camp === consts.CampType.WE) {
		return this.getCampEntities(consts.CampType.ENEMY);
	}
	return this.getCampEntities(consts.CampType.WE);
};

Arena.prototype.addPlayer = function(player) {
	if (!!this.players[player.userId]) {
		return false;
	}

	this.players[player.userId] = player;
	return true;
};

Arena.prototype.removePlayer = function(uid) {
	var player = this.players[uid];
	if (!player) return true;

	delete this.players[uid];
};

module.exports = Arena;