var bt = require('pomelo-bt');
var BTNode = bt.Node;
var util = require('util');
var utils = require('../../util/utils');

var Action = function(opts) {
	BTNode.call(this, opts.blackboard);
};
util.inherits(Action, BTNode);

module.exports = Action;

var pro = Action.prototype;

pro.doAction = function() {
	var character = this.blackboard.curCharacter;
	var targetId = this.blackboard.curTarget;
	if (!!targetId) {
		return bt.RES_SUCCESS;
	}
	utils.myPrint('1 ~ stand ', character.entityId);

	if (!this.blackboard.stand) {
		this.time = Date.now();
		if (this.blackboard.moved) {
			this.blackboard.arena.timer.abortAction('move', character.entityId);
			this.blackboard.moved = false;
		}
		character.stand();
		this.blackboard.stand = true;
	}
	else {
		var time = Date.now() - this.time;
		if (time >= 1000) {
			this.blackboard.stand = false;
			return bt.RES_FAIL;
		}
	}
	
	return bt.RES_WAIT;
};

module.exports.create = function() {
	return Action;
};