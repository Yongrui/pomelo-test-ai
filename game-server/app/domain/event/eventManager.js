var characterEvent = require('./characterEvent');
var arenaEvent = require('./arenaEvent');
var bulletEvent = require('./bulletEvent');

module.exports.addCharaterEvent = function (entity) {
	characterEvent.addEventForCharacter(entity);
};

module.exports.addArenaEvent = function(arena) {
	arenaEvent.addEventForArena(arena);
};

module.exports.addBulletEvent = function (bullet) {
	bulletEvent.addEventForBullet(bullet);
};