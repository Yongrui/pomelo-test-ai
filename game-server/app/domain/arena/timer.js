var utils = require('../../util/utils');

var Timer = function(opts) {
	this.arena = opts.arena;
	this.interval = opts.interval || 100;
	this.tickCnt = 0;
};

module.exports = Timer;

Timer.prototype.run = function() {
	this.handle = setInterval(this.tick.bind(this), this.interval);
};

Timer.prototype.close = function() {
	clearInterval(this.handle);
};

Timer.prototype.tick = function() {
	// utils.myPrint('tick = ', (++this.tickCnt) * this.interval);
	var arena = this.arena;
	arena.actionManager.update();
	arena.aiManager.update();
};

Timer.prototype.addAction = function(action) {
	return this.arena.actionManager.addAction(action);
};

Timer.prototype.abortAction = function(type, id) {
	return this.arena.actionManager.abortAction(type, id);
};

Timer.prototype.abortAllAction = function(id) {
	this.arena.actionManager.abortAllAction(id);
};

Timer.prototype.enterAI = function(entityId) {
	var arena = this.arena;

	this.abortAction('move', entityId);
	if (!!arena.entities[entityId]) {
		arena.aiManager.addCharacters([arena.entities[entityId]]);
	}
};