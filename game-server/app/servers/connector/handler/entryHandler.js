var arenaManager = require('../../../services/arenaManager');
var Player = require('../../../domain/entity/player');
var pomelo = require('pomelo');

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
	// next(null, {
	// 	code: 200,
	// 	msg: 'game server is ok.'
	// });


	var result = arenaManager.createArena();
	var arena = arenaManager.getArenaById(result.arenaId)
	var player = new Player({
		id: 1,
		userId: '123',
		name: 'lyr',
		camp: 'we',
		arena: arena
	});

	session.bind(player.userId);
	// session.set('serverId', pomelo.app.getServerId());
	// session.set('userId', player.userId);
	player.serverId = pomelo.app.getServerId();
	arena.createChannel();
	arena.addPlayer(player);
	arena.addPlayer2Channel(player);
	arena.start();
};

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function(msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({
			code: 200,
			msg: 'publish message is ok.'
		})
	};
	next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({
			code: 200,
			msg: 'subscribe message is ok.'
		})
	};
	next(null, result);
};