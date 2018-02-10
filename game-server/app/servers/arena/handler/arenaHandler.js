var arenaManager = require('../../../services/arenaManager');
var playerManager = require('../../../services/playerManager');
var pomelo = require('pomelo');
var utils = require('../../../util/utils');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

Handler.prototype.createArena = function(msg, session, next) {
	var uid = session.uid;
	var sid = session.get('serverId');
	if (playerManager.isPlayerInArena(uid)) {
		next();
		return;
	}

	var param = {
		uid: uid,
		sid: sid
	};
	this.app.rpc.arena.arenaRemote.createArena(session, param, function(err, msg) {
		next(null, ret);
	});
};

Handler.prototype.leaveArena = function(msg, session, next) {
	var uid = session.uid;
	if (!playerManager.isPlayerInArena(uid)) {
		next();
		return;
	}

	var player = playerManager.getPlayerByUid(uid);
	var playerId = player.id;
	var arenaId = player.arenaId;
	var param  = {
		playerId: playerId,
		arenaId: arenaId
	};
	this.app.rpc.arena.arenaRemote.leaveArenaById(session, param, function(err, msg) {
		next();
	});
};

Handler.prototype.kickOut = function(msg, session, next) {
	this.leaveArena(msg, session, next);
};

Handler.prototype.randomEntity = function(msg, session, next) {
	var uid = session.uid;
	if (!playerManager.isPlayerInArena(uid)) {
		next(null, {
			code: 501
		});
		return;
	}
	var player = playerManager.getPlayerByUid(uid);
	var arenaId = player.arenaId;
	if (arenaManager.randomEntity(arenaId)) {
		next(null, {
			code: 200
		});
	} else {
		next(null, {
			code: 500
		});
	}
};

Handler.prototype.start = function(msg, session, next) {
	var uid = session.uid;
	if (!playerManager.isPlayerInArena(uid)) {
		next(null, {
			code: 501
		});
		return;
	}
	var player = playerManager.getPlayerByUid(uid);
	var arenaId = player.arenaId;
	arenaManager.startArena(arenaId);
	next();
};