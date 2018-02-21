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
			next(err, ret);
			return;
		}
		var opuser = ret;
		var param = {
			uid: uid,
			sid: sid,
			opuid: opuser.id,
			opsid: opuser.sid
		};
		self.app.rpc.arena.arenaRemote.createArena(session, param, function(err, msg) {
			next(null, msg);
		});
	})
};

Handler.prototype.leaveArena = function(msg, session, next) {
	this.app.rpc.arena.arenaRemote.leaveArenaById(session, session.uid, function(err, msg) {
		next();
	});
};

Handler.prototype.kickOut = function(msg, session, next) {
	this.app.rpc.arena.arenaRemote.leaveArenaById(session, session.uid, function(err, msg) {
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