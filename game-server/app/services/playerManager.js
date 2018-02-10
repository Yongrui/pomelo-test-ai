var Player = require('../domain/entity/player');
var consts = require('../consts/consts');
var utils = require('../util/utils');

var exp = module.exports;

var gPlayerUidMap = {};
var gPlayerPidMap = {};
var gPlayerId = 1;

exp.getPlayerByUid = function(uid) {
	var player = gPlayerUidMap[uid];
	return player || null;
};

exp.getPlayerByPlayerId = function(playerId) {
	var player = gPlayerPidMap[playerId];
	return player || null;
}

exp.createPlayer = function(opts) {
	if (!!gPlayerUidMap[opts.uid]) {
		return {
			result: consts.PLAYER.ALREADY_EXISTED
		};
	}
	var player = new Player({
		id: gPlayerId++,
		userId: opts.uid,
		name: opts.uid,
		camp: consts.CampType.WE
	});
	player.serverId = opts.sid;

	gPlayerUidMap[opts.uid] = player;
	gPlayerPidMap[player.id] = player;
	return {
		result: consts.PLAYER.CREATE_SUCCESS,
		playerId: player.id
	};
};

exp.removePlayer = function(uid) {
	var player = gPlayerUidMap[uid];
	if (!!player) {
		delete gPlayerPidMap[player.id];
		delete gPlayerUidMap[uid];
	}
};

exp.isPlayerInArena = function(uid) {
	var player = this.getPlayerByUid(uid)
	if (!player) {
		return false;
	}
	return player.isInArena();
};