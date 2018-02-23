var pomelo = require('pomelo');
var utils = require('../../../util/utils');
var async = require('async');
var channelUtil = require('../../../util/channelUtil');

// var gID = 0;

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
	var sid = this.app.get('serverId');
	var opts = {sid: sid};
	var self = this;
	var user;

	async.waterfall([
		function (cb) {
			self.app.rpc.manager.userRemote.newUser(session, opts, cb);
		}, function (u, cb) {
			user = u;
			self.app.get('sessionService').kick(user.id, cb);
		}, function (cb) {
			session.bind(user.id, cb);
		}, function (cb) {
			session.on('closed', onUserLeave.bind(null, self.app, user));
			self.app.rpc.chat.chatRemote.add(session, user,
				channelUtil.getGlobalChannelName(), true, cb);
		}, function (users, cb) {
			self.app.rpc.manager.userRemote.getUsers(session, users, cb);
		}
	], function (err, users) {
		if (!!err) {
			next(null, {code: 500});
			return;
		}

		next(null, {code: 200, user: user, users: users});
	});
};

var onUserLeave = function (app, user, session) {
	if(!session || !session.uid) {
		return;
	}

	utils.myPrint('1 ~ OnUserLeave is running ...');
	
	var kickUid = session.uid;
	app.rpc.arena.arenaRemote.kickOut(session, {uid: kickUid}, function(err, ret) {
		utils.myPrint('1 ~ kickOut ', err, ret);
	});

	app.rpc.manager.userRemote.kickOut(session, {uid: kickUid}, function(err, ret) {
		utils.myPrint('2 ~ kickOut ', err, ret);
	});

	app.rpc.chat.chatRemote.kick(session, user, channelUtil.getGlobalChannelName(), function (err, ret) {
		utils.myPrint('3 ~ kickOut ', err, ret);
	});
};