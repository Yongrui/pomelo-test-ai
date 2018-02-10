var arenaManager = require('../../../services/arenaManager');
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
	arenaManager.kickOut(args, cb);
};