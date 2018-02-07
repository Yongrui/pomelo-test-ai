var bt = require('pomelo-bt');
var BTNode = bt.Node;
var util = require('util');
var utils = require('../../util/utils');

var  Action = function (opts) {
	BTNode.call(this, opts.blackboard);
};

util.inherits(Action, BTNode);

module.exports = Action;

Action.prototype.doAction = function() {
	var character = this.blackboard.curCharacter;
	if (!!character.target) {
		utils.myPrint('has target ', character.target);
		return bt.RES_SUCCESS;
	}

	character.target = character.getMostHater();
	if (!!character.target) {
		utils.myPrint('find target ', character.target);
		return bt.RES_SUCCESS;
	}

	return bt.RES_FAIL;
};