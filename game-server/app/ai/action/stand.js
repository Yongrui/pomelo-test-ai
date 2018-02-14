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
	utils.myPrint('1 ~ stand');
	var character = this.blackboard.curCharacter;
	var targetId = this.blackboard.curTarget;
	if (!!targetId) {
		return bt.RES_SUCCESS;
	}

	if (!this.blackboard.stand) {
		this.time = Date.now();
		utils.myPrint('3 ~ stand ');
		if (this.blackboard.moved) {
			utils.myPrint('4 ~ stand ');
			this.blackboard.arena.timer.abortAction('move', character.entityId);
		}
		character.stand();
		this.blackboard.stand = true;
	}
	else {
		var time = Date.now() - this.time;
		if (time > 1000) {
			this.blackboard.stand = false;
			return bt.RES_FAIL;
		}
	}
	
	return bt.RES_WAIT;
};

module.exports.create = function() {
	return Action;
};