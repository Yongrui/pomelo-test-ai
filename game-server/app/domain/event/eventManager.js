var characterEvent = require('./characterEvent');

module.exports.addEvent = function (entity) {
	characterEvent.addEventForCharacter(entity);
};