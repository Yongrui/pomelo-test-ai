var arenaManager = require('../../../services/arenaManager');
var Player = require('../../../domain/entity/player');
var pomelo = require('pomelo');
var utils = require('../../../util/utils');
var playerManager = require('../../../services/playerManager');

module.exports = function(app) {
	return new Handler(app);
};

var Handler = function(app) {
	this.app = app;
};

/**
 * New client entry.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
	var uid = '123';
	var sid = this.app.getServerId();
	session.bind(uid);
	session.set('serverId', sid);
	session.on('closed', onUserLeave.bind(null, this.app));
	var param = {
		uid: uid,
		sid: sid
	};
	this.app.rpc.arena.arenaRemote.createArena(session, param, function(err, msg) {
		next(null, msg);
	});
};

var onUserLeave = function (app, session) {
	if(!session || !session.uid) {
		return;
	}

	utils.myPrint('1 ~ OnUserLeave is running ...');
	// app.rpc.area.playerRemote.playerLeave(session, {playerId: session.get('playerId'), instanceId: session.get('instanceId')}, function(err){
	// 	if(!!err){
	// 		logger.error('user leave error! %j', err);
	// 	}
	// });
	// app.rpc.chat.chatRemote.kick(session, session.uid, null);
	if (!playerManager.isPlayerInArena(session.uid)) {
		return;
	}

	var player = playerManager.getPlayerByUid(uid);
	var playerId = player.id;
	var arenaId = player.arenaId;
	var param  = {
		playerId: playerId,
		arenaId: arenaId
	};
	app.rpc.arena.arenaRemote.leaveArenaById(session, param, null);
};