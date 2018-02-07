var Queue = require('pomelo-collection').queue;

var ActionManager = function(opts) {
	opts = opts || {};

	this.limit = opts.limit || 10000;

	//The map used to abort or cancel action, it's a two level map, first leven key is type, second leven is id
	this.actionMap = {};

	//The action queue, default size is 10000, all action in the action queue will excute in the FIFO order
	this.actionQueue = new Queue(this.limit);
};

ActionManager.prototype.addAction = function(action) {
	if (action.singleton) {
		this.abortAction(action.type, action.id);
	}

	this.actionMap[action.type] = this.actionMap[action.type] || {};

	this.actionMap[action.type][action.id] = action;

	return this.actionQueue.push(action);
};

ActionManager.prototype.abortAction = function(type, id) {
	if (!this.actionMap[type] || !this.actionMap[type][id]) {
		return;
	}

	this.actionMap[type][id].aborted = true;
	delete this.actionMap[type][id];
};

ActionManager.prototype.abortAllAction = function(id) {
	for (var type in this.actionMap) {
		if (!!this.actionMap[type][id]) {
			this.actionMap[type][id].aborted = true;
		}
	}
};

ActionManager.prototype.update = function() {
	var length = this.actionQueue.length;

	for (var i = 0; i < length; i++) {
		var action = this.actionQueue.pop();

		if (action.aborted) {
			continue;
		}

		action.update();
		if (!action.finished) {
			this.actionQueue.push(action);
		} else {
			delete this.actionMap[action.type][action.id];
		}
	}
};

module.exports = ActionManager;