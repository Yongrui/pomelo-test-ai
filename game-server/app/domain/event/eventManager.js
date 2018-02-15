var characterEvent = require('./characterEvent');
var arenaEvent = require('./arenaEvent');

module.exports.addCharaterEvent = function (entity) {
	characterEvent.addEventForCharacter(entity);
};

module.exports.addArenaEvent = function(arena) {
	arenaEvent.addEventForArena(arena);
};