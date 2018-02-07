var Blackboard = function(opts) {
	this.manager = opts.manager;
	this.arena = opts.arena;
	this.curCharacter = opts.curCharacter;
};

var pro = Blackboard.prototype;

module.exports.create = function(opts) {
	return new Blackboard(opts);
};