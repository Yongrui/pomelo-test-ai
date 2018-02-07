module.exports = function(app) {
	return new ArenaRemote();
};

var ArenaRemote = function() {
};

/**
 *	Add player into channel
 */
ArenaRemote.prototype.add = function(uid, playerName, channelName, cb) {
	cb();
};

/**
 * leave Channel
 * uid
 * channelName
 */
ArenaRemote.prototype.leaveArena =function(uid, channelName, cb){
	cb();
};

/**
 * kick out user
 *
 */
ArenaRemote.prototype.kickOut = function(uid, cb){
	cb();
};
