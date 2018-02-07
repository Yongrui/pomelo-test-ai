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
  next(null, {code: 200, msg: 'arena server is ok.'});
};

Handler.prototype.createArena = function(msg, session, next) {
	
};

Handler.prototype.leaveArena = function(msg, session, next) {
	
};

Handler.prototype.kickOut = function(msg, session, next) {
	
};
