var bt = require('pomelo-bt');
var BTNode = bt.Node;
var util = require('util');
var utils = require('../../util/utils');
var formula = require('../../consts/formula');

var  Action = function (opts) {
	BTNode.call(this, opts.blackboard);
};

util.inherits(Action, BTNode);

module.exports = Action;

Action.prototype.doAction = function() {
	var character = this.blackboard.curCharacter;
	var arena = this.blackboard.arena;
	if (!!character.target) {
		return bt.RES_SUCCESS;
	}

	var target = null;
	var result = character.getMostHaters();
	if (!!result && result.length > 0) {
		var es = arena.getEntities(result);
		target = getNearestTarget(character, es);
	}
	character.target = target;
	if (!!character.target) {
		return bt.RES_SUCCESS;
	}

	this.blackboard.arena.close();

	return bt.RES_FAIL;
};

function getNearestTarget (character, es) {
	var dist, cost = 999999;
	var target = null;
	for (var i = 0; i < es.length; i++) {
		dist = formula.distance(character.x, character.y, es[i].x, es[i].y);
		if (dist < cost) {
			target = es[i].entityId;
			cost = dist;
		}
	};
	return target;
}