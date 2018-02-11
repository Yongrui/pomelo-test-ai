function start () {
	var stage = new createjs.Stage("demoCanvas");

	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", stage);

	var size = 20;
	var map = new Map(960, 640, size, size);
	stage.addChild(map);

	function addEntity (data) {
		var color = 'red';
		if (data.camp == 'enemy') {
			color = 'blue';
		}
		var e = new Ball({
			id: data.entityId,
			hp: data.hp,
			x: data.x,
			y: data.y,
			speed: data.walkSpeed,
			radius: size/2,
			color: color
		});
		map.addEntity(e);
		return e;
	}

	function removeEntity(entityId) {
		map.removeEntity(entityId);
	}

	function movePath (data) {
		var entityId = data.entityId;
		var entity = map.getEntity(entityId);
		if (!entity) {
			console.log('no  entity ', entityId);
			return;
		}
		var path = data.path;
		if (!path || path.length <= 1) {
			return;
		}
		entity.movePath(path, data.walkSpeed);
	}

	pomelo.on('onMove', function(data) {
		// console.log(data.entityId, data.path);
		movePath(data);
	});

	var AttackResult = {
		SUCCESS: 1,
		KILLED: 2,
		MISS: 3,
		NOT_IN_RANGE: 4,
		NO_ENOUGH_MP: 5,
		NOT_COOLDOWN: 6,
		ATTACKER_CONFUSED: 7,
		ERROR: -1
	}

	function attack (data) {
		var attackerId = data.attacker;
		var targetId = data.target;
		var attacker = map.getEntity(attackerId);
		var target = map.getEntity(targetId);
		if (!attacker || !target) {
			return;
		}

		attacker.attack();

		var result = data.result.result;
		if (result === AttackResult.SUCCESS || result === AttackResult.KILLED) {
			target.update({damage: data.result.damage});
			if (result === AttackResult.KILLED) {
				target.died();
			}
		}
	}

	pomelo.on('onAttack', function(data) {
		// console.log('onAttack', data);
		attack(data);
	});

	pomelo.on('onAddEntities', function(data) {
		console.log('onAddEntities', data);
		var entities = data.entities;
		for (var i = 0; i < entities.length; i++) {
			addEntity(entities[i]);
		}
	});

	pomelo.on('onRemoveEntities', function(data) {
		console.log('onRemoveEntities', data);
		var entities = data.entities;
		for (var i = 0; i < entities.length; i++) {
			removeEntity(entities[i]);
		}
	});
}
