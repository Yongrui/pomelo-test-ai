var Arena = require('../domain/arena/arena');
var Map = require('../domain/arena/map');
var consts = require('../consts/consts');
var utils = require('../util/utils');
var Soldier = require('../domain/entity/soldier');

var exp = module.exports;

var gArenaObjDict = {};
var gArenaId = 0;

exp.createArena = function(data) {
	var arenaObj = new Arena({
		arenaId: ++gArenaId,
		map: new Map()
	});
	var result = arenaObj.addPlayer(data);
	if (result === consts.ARENA.ENTER_ARENA_CODE.OK) {
		gArenaObjDict[arenaObj.arenaId] = arenaObj;
	}
	return {
		result: result,
		arenaId: arenaObj.arenaId
	};
};

exp.getArenaById = function(arenaId) {
	var arenaObj = gArenaObjDict[arenaId];
	return arenaObj || null;
};

exp.removeArenaById = function(arenaId) {
	var arenaObj = gArenaObjDict[arenaId];
	if (!arenaObj) {
		return {
			result: consts.ARENA.FAILED
		};
	}
	delete gArenaObjDict[arenaId];
};

exp.randomEntity = function(arenaId) {
	var arenaObj = gArenaObjDict[arenaId];
	if (!arenaObj) {
		return false;
	}

	var rate = 0.5;
	var weEntities = arenaObj.getCampEntities(consts.CampType.WE);
	var enemyEntities = arenaObj.getCampEntities(consts.CampType.ENEMY);
	if (weEntities.length > enemyEntities.length) {
		rate = 0;
	}
	else if (weEntities.length < enemyEntities.length) {
		rate = 1;
	}

	var camp = consts.CampType.WE;
	if (Math.random() > rate) {
		camp = consts.CampType.ENEMY;
	}

	var x = utils.randomMN(0, 960);
	var y = utils.randomMN(0, 640);
	var range = utils.randomMN(40, 60);
	var hp = utils.randomMN(10, 30);
	var maxHp = hp;
	var walkSpeed = utils.randomMN(30, 100);
	var attackSpeed = 1;
	var e = new Soldier({
		name: 's',
		camp: camp,
		arena: arenaObj,
		x: x,
		y: y,
		range: range,
		hp: hp,
		maxHp: maxHp,
		walkSpeed: walkSpeed,
		attackSpeed: attackSpeed
	});
	e.entityName = 's' + e.entityId;

	return arenaObj.addEntity(e);
};

exp.leaveArenaById = function(playerId, arenaId, cb) {
	var arenaObj = gArenaObjDict[arenaId];
	if (!arenaObj) {
		utils.invokeCallback(cb, null, {
			result: consts.ARENA.FAILED
		});
		return;
	}

	arenaObj.removePlayer(playerId, function(err, ret) {
		utils.invokeCallback(cb, null, ret);
	});
};

exp.enterArenaById = function(playerId, arenaId, cb) {

};

exp.kickOut = function(args, cb) {
	if (!args || !args.arenaId) {
		utils.invokeCallback(cb, null, {result: consts.ARENA.FAILED});
		return;
	}
	this.leaveArenaById(args.kickedPlayerId, args.arenaId, function(err, ret) {
		utils.invokeCallback(cb, null, ret);
	});
};

exp.startArena = function(arenaId) {
	var arenaObj = gArenaObjDict[arenaId];
	if (arenaObj) {
		arenaObj.start();
	}
}