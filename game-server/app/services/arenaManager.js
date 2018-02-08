var Arena = require('../domain/arena/arena');
var Map = require('../domain/arena/map');
var consts = require('../consts/consts');
var Soldier = require('../domain/entity/soldier');

var exp = module.exports;

var gArenaObjDict = {};
var gArenaId = 0;

exp.createArena = function (data) {
	var arenaObj = new Arena({
		arenaId: ++gArenaId,
		map: new Map()
	});
	gArenaObjDict[arenaObj.arenaId] = arenaObj;

	var s1 = new Soldier({
		id: 1,
		name: 's1',
		camp: consts.CampType.WE,
		arena: arenaObj,
		x: 10,
		y: 10,
		range: 40,
		hp: 10,
		maxHp: 40,
		walkSpeed: 50,
		attackSpeed: 1
	});
	var s2 = new Soldier({
		id: 2,
		name: 's2',
		camp: consts.CampType.ENEMY,
		arena: arenaObj,
		x: 400,
		y: 300,
		range: 40,
		hp: 10,
		maxHp: 40,
		walkSpeed: 100,
		attackSpeed: 1
	});
	arenaObj.addEntity(s1);
	arenaObj.addEntity(s2);
	// arenaObj.start();

	return {result: consts.ARENA.CREATE_ARENA_CODE.OK, arenaId: arenaObj.arenaId};
};

exp.getArenaById = function (arenaId) {
	var arenaObj = gArenaObjDict[arenaId];
	return arenaObj || null;
};

exp.removeArenaById = function (arenaId) {
	var arenaObj = gArenaObjDict[arenaId];
	if (!arenaObj) {
		return {result: consts.ARENA.FAILED};
	}
	delete gArenaObjDict[arenaId];
}