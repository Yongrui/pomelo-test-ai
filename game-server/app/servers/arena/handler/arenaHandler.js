var arenaManager = require('../../../services/arenaManager');
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
	var sid = session.frontendId;
	var param = {
		uid: uid,
		sid: sid
	};
	var self = this;
	this.app.rpc.manager.userRemote.match(session, param, function(err, ret) {
		if (!!err) {
			next(null, {code: 500});
			return;
		}
		var opuser = ret;
		var param = {
			uid: uid,
			sid: sid,
			opuid: opuser.id,
			opsid: opuser.sid
		};
		var result = arenaManager.createArena(param);
		next(null, result);
	});
};

Handler.prototype.leaveArena = function(msg, session, next) {
	arenaManager.leaveArenaById(session.uid, function(err, msg) {
		next();
	});
};

Handler.prototype.kickOut = function(msg, session, next) {
	arenaManager.kickOut({uid: session.uid}, function(err, msg) {
		next();
	});
};

Handler.prototype.randomEntity = function(msg, session, next) {
	var uid = session.uid;
	utils.myPrint('1 ~ randomEntity ', uid);
	if (arenaManager.randomEntity(uid)) {
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
	arenaManager.startArena(uid);
	next();
};

Handler.prototype.invite = function(msg, session, next) {
	var uid = session.uid;
	var opuid = msg.opuid;
	var opsid = msg.opsid;
	if (!opsid || !opuid) {
		next(null, {code: 500});
		return;
	}
	// var uids = [uid, opuid];
	// this.app.rpc.manager.userRemote.getUsers(session, uids, function (err, users) {
	// 	var param = {
	// 		uid: users[0].id,
	// 		sid: users[0].sid,
	// 		opuid: users[1].id,
	// 		opsid: users[1].sid
	// 	};
	// 	var result = arenaManager.createArena(param);
	// 	next(null, result);
	// });
	
	var channelService = this.app.get('channelService');
	channelService.pushMessageByUids("onBeInvited", {from: uid}, [{uid: opuid, sid: opsid}])
	next(null, {
		route: msg.route
	});
};

Handler.prototype.acceptInvite = function(msg, session, next) {
	
};