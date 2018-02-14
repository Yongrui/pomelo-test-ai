var Arena = require('../domain/arena/arena');
var Map = require('../domain/arena/map');
var consts = require('../consts/consts');
var utils = require('../util/utils');
var Soldier = require('../domain/entity/soldier');
var Player = require('../domain/entity/player');

var exp = module.exports;

var uidMap = {};
var gArenaObjDict = {};
var gArenaId = 0;
var gPlayerId = 0;

var addRecord = function(arenaId, data, playerId) {
	var record = {
		uid: data.uid,
		sid: data.sid,
		arenaId: arenaId,
		playerId: playerId
	};
	uidMap[data.uid] = record;
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
	if (checkDuplicate(data.uid)) {
		return {
			result: consts.ARENA.ENTER_ARENA_CODE.ALREADY_IN_ARENA
		};
	}
	var arenaObj = new Arena({
		arenaId: ++gArenaId,
		map: new Map()
	});
	data.id = ++gPlayerId;
	var player = new Player(data);
	var result = arenaObj.addPlayer(player);
	if (result === consts.ARENA.ENTER_ARENA_CODE.OK) {
		gArenaObjDict[arenaObj.arenaId] = arenaObj;
		addRecord(arenaObj.arenaId, data, player.id);
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

	var players = arenaObj.getAllPlayers();
	for (var i = 0; i < players.length; i++) {
		removeRecord(players[i].userId);
	}
	delete gArenaObjDict[arenaId];
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

exp.leaveArenaById = function(uid, cb) {
	var record = getRecord(uid);
	if (!record) {
		utils.invokeCallback(cb, null, {
			result: consts.ARENA.FAILED
		});
		return;
	}

	var arenaId  = record.arenaId;
	var playerId = record.playerId;
	var arenaObj = gArenaObjDict[arenaId];
	if (!arenaObj) {
		utils.invokeCallback(cb, null, {
			result: consts.ARENA.FAILED
		});
		return;
	}

	arenaObj.removePlayer(playerId, function(err, ret) {
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
	if (arenaObj) {
		arenaObj.start();
		return true;
	}
	return false;
}