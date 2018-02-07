var Blackboard = require('../meta/blackboard');
var utils = require('../../util/utils');

var Manager = function(opts) {
	this.brainService = opts.brainService;
	this.arena = opts.arena;
	this.entities = {};
};

module.exports = Manager;

Manager.prototype.start = function() {
	this.started = true;
};

Manager.prototype.stop = function() {
	this.closed = true;
};

Manager.prototype.addCharacters = function(cs) {
	utils.myPrint('aiManager addCharacters');
	// if(!this.started || this.closed) {
	// 	return;
	// }

	if(!cs || !cs.length) {
		return;
	}

	var c;
	for(var i=0, l=cs.length; i<l; i++) {
		c = cs[i];
		var brain;
		if (!!this.entities[c.entityId]) {
			continue;
		}

		brain = this.brainService.getBrain("infantry", Blackboard.create({
			manager: this,
			arena: this.arena,
			curCharacter: c
		}));
		this.entities[c.entityId] = brain;
	}
};

Manager.prototype.removeCharacter = function(id) {
	utils.myPrint('aiManager removeCharacter ', id);
	// if (!this.started || this.closed) {
	// 	return;
	// }

	delete this.entities[id];
};

Manager.prototype.update = function() {
	// utils.myPrint('aiManager update ', this.started, this.closed);
	if (!this.started || this.closed) {
		return;
	}

	var id;
	for (id in this.entities) {
		if (typeof this.entities[id].update === 'function') {
			this.entities[id].update();
		}
	}
};