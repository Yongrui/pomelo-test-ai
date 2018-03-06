var bt = require('pomelo-bt');
var BTNode = bt.Node;
var util = require('util');
var EntityType = require('../../consts/consts').EntityType;
var utils = require('../../util/utils');
var formula = require('../../consts/formula');

var Action = function(opts) {
	BTNode.call(this, opts.blackboard);
};

util.inherits(Action, BTNode);

module.exports = Action;

Action.prototype.doAction = function() {
	var character = this.blackboard.curCharacter;
	var targetId = this.blackboard.curTarget;
	var distance = this.blackboard.distanceLimit || character.range;
	var target = this.blackboard.arena.getEntity(targetId);
	// utils.myPrint('MoveToTarget ', character.entityName);

	if (!target) {
		// target has disappeared or died
		character.forgetHater(targetId);
		return bt.RES_FAIL;
	}

	if (targetId !== character.target) {
		//target has changed
		this.blackboard.curTarget = null;
		this.blackboard.distanceLimit = 0;
		this.blackboard.targetPos = null;
		this.blackboard.moved = false;
		return bt.RES_FAIL;
	}

	if (target.camp === character.camp) {
		this.blackboard.curTarget = null;
		this.blackboard.distanceLimit = 0;
		this.blackboard.targetPos = null;
		this.blackboard.moved = false;
		return bt.RES_FAIL;
	}

	if (formula.inRange(character, target)) {
		this.blackboard.arena.timer.abortAction('move', character.entityId);
		this.blackboard.distanceLimit = 0;
		this.blackboard.moved = false;
		return bt.RES_SUCCESS;
	}

	var targetPos = this.blackboard.targetPos;
	var closure = this;

	if (!this.blackboard.moved) {
		character.move(target.x, target.y, function(err, result) {
			// utils.myPrint('MoveToTarget- ', target.entityName, target.x, target.y, result);
			if (err || result === false) {
				closure.blackboard.moved = false;
				character.target = null;
			}
		});

		this.blackboard.targetPos = {
			x: target.x,
			y: target.y
		};
		this.blackboard.moved = true;
	} else if (targetPos && (targetPos.x !== target.x || targetPos.y !== target.y)) {
		var dis1 = formula.distance(targetPos.x, targetPos.y, target.x, target.y);
		var dis2 = formula.distance(character.x, character.y, target.x, target.y);

		// utils.myPrint('target pos change ', character.x, character.y, targetPos.x, targetPos.y, target.x, target.y);
		//target position has changed
		// if (((dis1 * 3 > dis2) && (dis1 < distance)) || !this.blackboard.moved) {
			targetPos.x = target.x;
			targetPos.y = target.y;

			character.move(target.x, target.y, function(err, result) {
				// utils.myPrint('MoveToTarget= ', target.x, target.y);
				if (err || result === false) {
					closure.blackboard.moved = false;
					character.target = null;
				}
			});
		// }
	}
	return bt.RES_WAIT;
};