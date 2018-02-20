var consts = require('../../consts/consts');
var pomelo = require('pomelo');
var utils = require('../../util/utils');
var ai = require('../../ai/ai');
var ActionManager = require('./../action/actionManager');
var eventManager = require('./../event/eventManager');
var channelUtil = require('../../util/channelUtil');
var Timer = require('./timer');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function Arena (opts) {
	EventEmitter.call(this);
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

	eventManager.addArenaEvent(this);
};

util.inherits(Arena, EventEmitter);

Arena.prototype.initSoldiers = function(data) {

};

Arena.prototype.initPlayers = function(data) {

};

Arena.prototype.start = function() {
	this.aiManager.start();
	this.timer.run();
};

Arena.prototype.close = function() {
	this.timer.close();
	this.emit('close', {
		arena: this
	});
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

	utils.myPrint('1 ~ Arena addPlayer2Channel ', data.uid, data.sid);
	if (!!data && !!data.uid && !!data.sid) {
		this.channel.add(data.uid, data.sid);
		return true;
	}

	return false;
};

Arena.prototype.removePlayerFromChannel = function(data) {
	if (!this.channel) {
		return false;
	}

	utils.myPrint('1 ~ Arena removePlayerFromChannel ', data.uid, data.sid);
	if (!!data && !!data.uid && !!data.sid) {
		this.channel.leave(data.uid, data.sid);
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

	eventManager.addCharaterEvent(e);
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

Arena.prototype.isPlayerInArena = function(uid) {
	return !!this.players[uid];
};

Arena.prototype.addPlayer = function(player) {
	if (!!this.players[player.uid]) {
		return consts.ARENA.ENTER_ARENA_CODE.ALREADY_IN_ARENA;
	}

	if (!this.addPlayer2Channel(player)) {
		return consts.ARENA.ENTER_ARENA_CODE.SYS_ERROR;
	}

	player.enterArena(this.arenaId);
	this.players[player.uid] = player;

	return consts.ARENA.ENTER_ARENA_CODE.OK;
};

Arena.prototype.removePlayer = function(uid, cb) {
	var player = this.players[uid];
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
	delete this.players[uid];
	var ret = {result: consts.ARENA.OK};
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

Arena.prototype.pushLeaveMsg2All = function(leavePlayerUid, cb) {
	var result = this.pushMsg2All('onPlayerLeaveArena', {
		playerUid: leavePlayerUid
	}, function(err, _) {
		var ret = {result: consts.ARENA.OK};
		cb(null, ret);
	});
	if (!result) {
		var ret = {result: consts.ARENA.FAILED};
		cb(null, ret)
	}
};

module.exports = Arena;