var Arena = require('../domain/arena/arena');
var Map = require('../domain/arena/map');
var consts = require('../consts/consts');
var utils = require('../util/utils');
var Soldier = require('../domain/entity/soldier');
var Player = require('../domain/entity/player');
var dataApi = require('../util/dataApi');

var exp = module.exports;

var uidMap = {};
var gArenaObjDict = {};
var gArenaId = 0;

var addRecord = function(arenaId, data) {
	var record = {
		uid: data.uid,
		sid: data.sid,
		arenaId: arenaId
	};
	uidMap[data.uid] = record;
	if (!!data.opuid && !!data.opsid) {
		uidMap[data.opuid] = {
			uid: data.opuid,
			sid: data.opsid,
			arenaId: arenaId
		};
	}
	utils.myPrint('addRecord ', JSON.stringify(uidMap));
};

var removeRecord = function(uid) {
	utils.myPrint('removeRecord ', uid, JSON.stringify(uidMap));
	if (!uidMap[uid]) {
		return;
	}

	delete uidMap[uid];
}

var checkDuplicate = function(uid) {
	return !!uidMap[uid];
};

var getRecord = function(uid) {
	return uidMap[uid] || null;
};

exp.createArena = function(data) {
	if (checkDuplicate(data.uid) || checkDuplicate(data.opuid)) {
		return {
			result: consts.ARENA.ENTER_ARENA_CODE.ALREADY_IN_ARENA
		};
	}
	var arenaObj = new Arena({
		arenaId: ++gArenaId,
		map: new Map()
	});
	var result = arenaObj.initPlayers(data);
	if (result === consts.ARENA.ENTER_ARENA_CODE.OK) {
		gArenaObjDict[arenaObj.arenaId] = arenaObj;
		addRecord(arenaObj.arenaId, data);
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
	utils.myPrint('1 ~ removeArenaById ', arenaId, arenaObj);
	if (!arenaObj) {
		return {
			result: consts.ARENA.FAILED
		};
	}

	var players = arenaObj.getAllPlayers();
	for (var i = 0; i < players.length; i++) {
		removeRecord(players[i].uid);
	}
	delete gArenaObjDict[arenaId];
	return {
		result: consts.ARENA.OK
	};
};

var buildCharacterData = function(kindId) {
	var data = dataApi.character.findById(kindId);
	if (!data) {
		return null;
	}

	return {
		kindId: data.id,
		kindName: data.name,
		name: data.name,
		range: data.range,
		hp: data.hp,
		maxHp: data.hp,
		walkSpeed: data.walkSpeed,
		attackSpeed: data.attackSpeed
	};
};

exp.randomEntity = function(uid) {
	var record = getRecord(uid);
	if (!record) {
		return false;
	}

	var arenaId  = record.arenaId;
	var arenaObj = gArenaObjDict[arenaId];
	if (!arenaObj) {
		return false;
	}

	var rate = 0.5;
	var weEntities = arenaObj.getCampEntities(consts.CampType.WE);
	var enemyEntities = arenaObj.getCampEntities(consts.CampType.ENEMY);
	utils.myPrint('randomEntity ', weEntities.length, enemyEntities.length);
	if (weEntities.length > enemyEntities.length) {
		rate = 0;
	} else if (weEntities.length < enemyEntities.length) {
		rate = 1;
	}

	var camp = consts.CampType.WE;
	if (Math.random() > rate) {
		camp = consts.CampType.ENEMY;
	}

	var kindId = utils.random01() > 0.5 ? 201 : 101;
	var data = buildCharacterData(kindId);
	if (!data) {
		return false;
	}
	data.x = utils.randomMN(0, 960);
	data.y = utils.randomMN(0, 640);
	data.attackRange = 5;
	data.camp = camp;
	data.arena = arenaObj;
	var e = new Soldier(data);
	e.entityName = e.kindName + e.entityId;

	return arenaObj.addEntity(e);
};

exp.leaveArenaById = function(uid, cb) {
	var record = getRecord(uid);
	if (!record) {
		utils.invokeCallback(cb, null, {
			result: consts.ARENA.FAILED
		});
		return;
	}

	var arenaId  = record.arenaId;
	var uid = record.uid;
	var arenaObj = gArenaObjDict[arenaId];
	if (!arenaObj) {
		utils.invokeCallback(cb, null, {
			result: consts.ARENA.FAILED
		});
		return;
	}

	arenaObj.removePlayer(uid, function(err, ret) {
		utils.myPrint('leaveArenaById cb ', err, JSON.stringify(ret));
		utils.invokeCallback(cb, null, ret);
	});
};

exp.enterArenaById = function(uid, cb) {

};

exp.kickOut = function(uid, cb) {
	this.leaveArenaById(uid, function(err, ret) {
		utils.myPrint('kickOut cb ', err, JSON.stringify(ret));
		utils.invokeCallback(cb, null, ret);
	});
};

exp.startArena = function(uid) {
	var record = getRecord(uid);
	if (!record) {
		return true;
	}

	var arenaId  = record.arenaId;
	var arenaObj = gArenaObjDict[arenaId];
	if (arenaObj && !arenaObj.isRunning()) {
		arenaObj.start();
		return true;
	}
	return false;
}