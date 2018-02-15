var consts = require('../../consts/consts');
var pomelo = require('pomelo');
var utils = require('../../util/utils');
var arenaManager = require('../../services/arenaManager');

module.exports.addEventForArena = function(arena) {
	arena.on('close', function(args) {
		var ret = arenaManager.removeArenaById(args.arena.arenaId);
		if (ret.result === consts.ARENA.OK) {
			args.arena.pushMsg2All('onCloseArena', {
				arenaId: args.arena.arenaId
			});
		}
	});
};