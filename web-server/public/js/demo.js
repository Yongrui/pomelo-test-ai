function start () {
	var stage = new createjs.Stage("demoCanvas");

	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", stage);

	var size = 20;
	var map = new Map(960, 640, size, size);
	stage.addChild(map);

	function addEntity (data) {
		var e = new Ball(data);
		map.addEntity(e);
		return e;
	}

	var EA = addEntity({
		id: 1,
		radius: size,
		color: 'red',
		hp: 10,
		map: map
	});
	var EB = addEntity({
		id: 2,
		radius: size,
		color: 'blue',
		hp: 10,
		map: map
	});

	function movePath (data) {
		var entityId = data.entityId;
		var entity = map.getEntity(entityId);
		if (!entity) {
			return;
		}
		var path = data.path;
		if (!path || path.length <= 1) {
			return;
		}
		entity.movePath(path, data.speed);
	}

	pomelo.on('onMove', function(data) {
		// console.log(data.path);
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
		if (result === AttackResult.KILLED) {
			target.died();
		}
	}

	pomelo.on('onAttack', function(data) {
		// console.log(data);
		attack(data);
	});
}
