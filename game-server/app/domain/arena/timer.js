var utils = require('../../util/utils');

var Timer = function(opts) {
	this.arena = opts.arena;
	this.interval = opts.interval || 100;
	this.tickCnt = 0;
	this.duraion = opts.duraion || 60 * 1000 * 3;
	this.running = false;
};

module.exports = Timer;

Timer.prototype.run = function() {
	this.handle = setInterval(this.tick.bind(this), this.interval);
	this.running = true;
};

Timer.prototype.close = function() {
	clearInterval(this.handle);
	this.running = false;
};

Timer.prototype.tick = function() {
	var arena = this.arena;

	for (var id in arena.bullets) {
		var bullet = arena.entities[id];
		bullet.update();

		if (bullet.died) {
			arena.pushMsg2All('onRemoveEntities', {entities: [id]});
			arena.removeEntity(id);
		}
	}

	arena.actionManager.update();
	arena.aiManager.update();

	if ((++this.tickCnt * this.interval) >= this.duraion) {
	}
};

Timer.prototype.isRunning = function() {
	return this.running;
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