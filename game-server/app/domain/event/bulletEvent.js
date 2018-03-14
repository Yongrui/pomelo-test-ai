var Move = require('./../action/move');
var consts = require('../../consts/consts');

module.exports.addEventForBullet = function(bullet) {
	bullet.on('fire', function(args) {
		var bullet = args.bullet;
		var arena = bullet.arena;
		var speed = bullet.speed;
		var paths = args.paths;
		var action = new Move({
			entity: bullet,
			path: paths,
			speed: speed
		});

		if (arena.timer.addAction(action)) {
			arena.pushMsg2All('onMove', {
				entityId: bullet.entityId,
				path: paths,
				speed: speed
			});
		}
	});
};