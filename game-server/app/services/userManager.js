var User = require('../module/user');
var utils = require('../util/utils');
var exp = module.exports;
var gID = 0;
var gUserDict = {};

exp.newUser = function(opts) {
	var data = {
		id: ++gID,
		sid: opts.sid
	};
	var user = new User(data);
	gUserDict[user.id] = user;
	return user;
};

exp.kickOut = function(uid) {
	delete gUserDict[uid];
};

exp.getMatchUser = function(uid) {
	for (var id in gUserDict) {
		if (id != uid) {
			return gUserDict[id];
		}
	}
	return null;
};

exp.getUsers = function (uids) {
	var result = [];
	for (var i = 0; i < uids.length; i++) {
		result.push(gUserDict[uids[i]]);
	};
	return result;
};