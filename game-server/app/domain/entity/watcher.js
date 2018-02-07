var util = require('util');
var Entity = require('./entity');

var Watcher = function (opts) {
	Entity.call(this, opts);
	this.id = opts.id;
	this.type = EntityType.PLAYER;
	this.userId = opts.userId;
	this.name = opts.name;
};

util.inherits(Watcher, Entity);

module.exports = Watcher;