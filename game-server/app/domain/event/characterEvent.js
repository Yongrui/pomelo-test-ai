var Move = require('./../action/move');
var consts = require('../../consts/consts');

module.exports.addEventForCharacter = function(character) {
	character.on('move', function(args) {
		var character = args.character;
		var arena = character.arena;
		var speed = character.walkSpeed;
		var paths = args.paths;
		var action = new Move({
			entity: character,
			path: paths,
			speed: speed
		});

		if (arena.timer.addAction(action)) {
			arena.pushMsg2All('onMove', {
				entityId: character.entityId,
				path: paths,
				speed: speed
			});
		}
	});

	character.on('attack', function(args) {
		var result = args.result;
		var attacker = args.attacker;
		var target = args.target;
		var arena = target.arena;
		var timer = arena.timer;

		if (!target || !attacker) {
			return;
		}

		if (result.result === consts.AttackResult.KILLED) {
			arena.removeEntity(target.entityId);
			attacker.target = null;
		} else if (result.result === consts.AttackResult.SUCCESS) {

		}

		arena.pushMsg2All('onAttack', {
			attacker: attacker.toJSON4Attack(),
			target: target.toJSON4Attack(),
			result: args.result,
			skillId: args.skillId
		});
	});

	character.on('stand', function(args) {
		var character = args.character;
		var arena = character.arena;
		arena.pushMsg2All('onStand', {
			entityId: character.entityId,
			x: character.x,
			y: character.y
		});
	});
};