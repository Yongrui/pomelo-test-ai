var arenaManager = require('../../../services/arenaManager');
var playerManager = require('../../../services/playerManager');
var pomelo = require('pomelo');
var utils = require('../../../util/utils');

module.exports = function(app) {
	return new ArenaRemote();
};

var ArenaRemote = function() {};

ArenaRemote.prototype.leaveArenaById = function(args, cb) {
	var playerId = args.playerId;
	var arenaId = args.arenaId;
	arenaManager.leaveArenaById(playerId, arenaId, cb);
};

ArenaRemote.prototype.createArena = function(args, cb) {
	var ret = arenaManager.createArena(args);
	utils.invokeCallback(cb, null, ret);
};

ArenaRemote.prototype.kickOut = function(args, cb) {
	utils.myPrint('1 ~ ArenaRemote kickOut is running ...');
	if (!playerManager.isPlayerInArena(args.uid)) {
		return;
	}

	utils.myPrint('2 ~ ArenaRemote kickOut is running ...');
	var player = playerManager.getPlayerByUid(args.uid);
	var playerId = player.id;
	var arenaId = player.arenaId;
	var param  = {
		kickedPlayerId: playerId,
		arenaId: arenaId
	};
	arenaManager.kickOut(param, cb);
};