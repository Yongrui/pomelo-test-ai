var arenaManager = require('../../../services/arenaManager');
var pomelo = require('pomelo');
var utils = require('../../../util/utils');
var consts = require('../../../consts/consts');

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

	if (!arenaManager.invite(uid, opuid)) {
		next(null, {code: 500});
		return;
	}
	
	var channelService = this.app.get('channelService');
	channelService.pushMessageByUids("onBeInvited", {from: uid}, [{uid: opuid, sid: opsid}]);
	next(null, {
		code: 200
	});
};

Handler.prototype.acceptInvite = function(msg, session, next) {
	var uid = session.uid;
	var fromId = msg.from;
	var _this = this;
	this.app.rpc.manager.userRemote.getUsers(session, [fromId, uid], function(err, users) {
		if (err) {
			return;
		}

		var param = {
			uid: users[0].id,
			sid: users[0].sid,
			opuid: users[1].id,
			opsid: users[1].sid
		};
		var result = arenaManager.createArena(param);
		if (result.result === consts.ARENA.ENTER_ARENA_CODE.OK) {
			var channelService = _this.app.get('channelService');
			channelService.pushMessageByUids("onCreateArena", 
				{from: param.uid, to: param.opuid}, [
				{uid: param.uid, sid: param.sid}, 
				{uid: param.opuid, sid: param.opsid}
			]);
		}
		next();
	});
};