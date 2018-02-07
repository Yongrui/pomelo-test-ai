function start () {
	// var stage = new createjs.Stage("demoCanvas");

	// createjs.Ticker.setFPS(60);
	// createjs.Ticker.addEventListener("tick", stage);

	// var size = 10;
	// var map = new Map(960, 640, size, size);
	// stage.addChild(map);

	// function addEntity (data) {
	// 	var e = new Ball(data);
	// 	map.addEntity(e);
	// 	return e;
	// }

	// var EA = addEntity({
	// 	id: 1,
	// 	radius: size,
	// 	color: 'red',
	// 	hp: 10,
	// 	map: map
	// });
	// var EB = addEntity({
	// 	id: 2,
	// 	radius: size,
	// 	color: 'blue',
	// 	hp: 10,
	// 	map: map
	// });

	// EA.setTilePos(20, 20);
	// EB.setTilePos(25, 20);

	// function moveEntity (entity, time) {
	// 	var path = entity.path;
	// 	var tilePos = path.shift();
	// 	if (!!entity.lastTile) {
	// 		console.log('last ', entity.id, entity.lastTile);
	// 		entity.setTilePos(entity.lastTile.x, entity.lastTile.y);
	// 	}
	// 	if (!tilePos) {
	// 		entity.isMoving = false;
	// 		entity.lastTile = null;
	// 		return;
	// 	}
	// 	console.log('move ', entity.id, tilePos);
	// 	entity.isMoving = true;
	// 	entity.lastTile = tilePos;
	// 	var pos = map.calcPosByTile(tilePos.x, tilePos.y);
	// 	createjs.Tween.get(entity).to(pos, time).call(moveEntity, [entity, time], this);
	// }

	// function distance (sx, sy, ex, ey) {
	// 	var dx = ex - sx;
	// 	var dy = ey - sy;

	// 	return Math.sqrt(dx * dx + dy * dy);
	// };

	// function movePath (data) {
	// 	var entityId = data.entityId;
	// 	var entity = map.getEntity(entityId);
	// 	if (!entity) {
	// 		return;
	// 	}
	// 	var path = data.path;
	// 	console.log('path ', entityId, path[0], path[1]);
	// 	var servPos = path.shift();
	// 	var clientPos = entity.getTilePos();
	// 	// if (servPos.x !== clientPos.tx || servPos.y !== clientPos.ty) {
	// 	// 	console.log('fix ', entityId, clientPos);
	// 	// 	entity.setTilePos(servPos.x, servPos.y);
	// 	// }
	// 	var w = map.tileW;
	// 	var h = map.tileH;
	// 	var d1 = Math.sqrt(w * w + h * h);
	// 	var p1 = map.calcPosByTile(servPos.x, servPos.y);
	// 	var d2 = distance(p1.x, p1.y, entity.x, entity.y);
	// 	// if (d2 > d1) {
	// 	// 	console.log('fix ', entityId, clientPos);
	// 	// 	entity.setTilePos(servPos.x, servPos.y);
	// 	// }
	// 	entity.path = path;
	// 	if (!entity.isMoving) {
	// 		console.log('speed ', entityId, data.speed)
	// 		moveEntity(entity, 1/data.speed*1000);
	// 	}
	// }

	pomelo.on('onMove', function(data) {
		console.log(data.path);
		// movePath(data);
	});

	// var AttackResult = {
	// 	SUCCESS: 1,
	// 	KILLED: 2,
	// 	MISS: 3,
	// 	NOT_IN_RANGE: 4,
	// 	NO_ENOUGH_MP: 5,
	// 	NOT_COOLDOWN: 6,
	// 	ATTACKER_CONFUSED: 7,
	// 	ERROR: -1
	// }

	// function attack (data) {
	// 	var attackerId = data.attacker;
	// 	var targetId = data.target;
	// 	var attacker = map.getEntity(attackerId);
	// 	var target = map.getEntity(targetId);
	// 	if (!attacker || !target) {
	// 		return;
	// 	}
	// 	attacker.path = [];
	// 	var result = data.result;
	// 	if (result.result === AttackResult.KILLED) {
	// 		target.path = [];
	// 	}
	// }

	pomelo.on('onAttack', function(data) {
		// console.log(data);
		// attack(data);
	});
}
