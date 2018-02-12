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
		this.createChannel();
	}

	utils.myPrint('1 ~ Arena addPlayer2Channel ', data.userId, data.serverId);
	if (!!data && !!data.userId && !!data.serverId) {
		this.channel.add(data.userId, data.serverId);
		return true;
	}

	return false;
};

Arena.prototype.removePlayerFromChannel = function(data) {
	if (!this.channel) {
		return false;
	}

	utils.myPrint('1 ~ Arena removePlayerFromChannel ', data.userId, data.serverId);
	if (!!data && !!data.userId && !!data.serverId) {
		this.channel.leave(data.userId, data.serverId);
		return true;
	}

	return false;
};

Arena.prototype.pushMsg2All = function(route, content, cb) {
	if (!this.channel) {
		return false;
	}

	this.channel.pushMessage(route, content, cb);
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
	for (var i = 0; i < enemies.length; i++) {
		e.increaseHateFor(enemies[i].entityId, 5);
		enemies[i].increaseHateFor(e.entityId, 5);
	}

	eventManager.addEvent(e);
	this.aiManager.addCharacters([e]);

	this.pushMsg2All('onAddEntities', {entities: [e]}, null);
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

	this.pushMsg2All('onRemoveEntities', {entities: [entityId]}, null);

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
	var result = [];
	var entities = this.entities;

	for (var id in entities) {
		if (entities[id].camp === camp) {
			result.push(entities[id]);
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

Arena.prototype.isPlayerInArena = function(playerId) {
	return !!this.players[playerId];
};

Arena.prototype.addPlayer = function(player) {
	if (!!this.players[player.id]) {
		return consts.ARENA.ENTER_ARENA_CODE.ALREADY_IN_ARENA;
	}

	if (!this.addPlayer2Channel(player)) {
		return consts.ARENA.ENTER_ARENA_CODE.SYS_ERROR;
	}

	player.enterArena(this.arenaId);
	this.players[player.id] = player;

	return consts.ARENA.ENTER_ARENA_CODE.OK;
};

Arena.prototype.removePlayer = function(playerId, cb) {
	var player = this.players[playerId];
	if (!player) {
		var ret = {result: consts.ARENA.FAILED};
		utils.invokeCallback(cb, null, ret);
		return false;
	}

	if (!player.leaveArena()) {
		var ret = {result: consts.ARENA.FAILED};
		utils.invokeCallback(cb, null, ret);
		return false;
	}

	this.removePlayerFromChannel(player);
	delete this.players[playerId];
	utils.invokeCallback(cb, null, ret);
	return true;
};

Arena.prototype.getAllPlayers = function() {
	var _players = [];
	for (var id in this.players) {
		_players.push(this.players[id]);
	}

	return _players;
}

Arena.prototype.pushLeaveMsg2All = function(leavePlayerId, cb) {
	var ret = {result: consts.ARENA.OK};
	if (!this.channel) {
		cb(null, ret);
		return;
	}

	this.pushMsg2All('onPlayerLeaveArena', {
		playerId: leavePlayerId
	}, function(err, _) {
		cb(null, ret);
	});
};

module.exports = Arena;