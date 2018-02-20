var EventEmitter = require('events').EventEmitter;
var util = require('util');

var gId = 1;

var Entity = function (opts) {
	EventEmitter.call(this);
	this.entityId = opts.id || gId++;
	this.entityName = opts.name;
	this.kindId = opts.kindId;
	this.kindName = opts.kindName;
	this.camp = opts.camp;
	this.arena = opts.arena;
};

util.inherits(Entity, EventEmitter);

module.exports = Entity;

Entity.prototype.getEntityId = function() {
	return this.entityId;
};