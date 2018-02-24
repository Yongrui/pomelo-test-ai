
var pomelo, stage, arena;
var host = "127.0.0.1";
var port = "3010";
var CANVAS_WIDTH = 960,
	CANVAS_HEIGHT = 640,
	GRID_SIZE = 20;
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
var user, users, opuser;

$(function() {
	pomelo = window.pomelo;
	stage = new createjs.Stage("demoCanvas");
	createjs.Ticker.setFPS(60);
	createjs.Ticker.addEventListener("tick", stage);

	$('#enter-room').click(function () {
		createRoom();
	});

	connect();

	pomelo.on('onMove', function(data) {
		onEntityMove(data);
	});


	pomelo.on('onAttack', function(data) {
		console.log('onAttack', data);
		onEntityAttack(data);
	});

	pomelo.on('onAddEntities', function(data) {
		console.log('onAddEntities', data);
		var entities = data.entities;
		onAddEntities(entities);
	});

	pomelo.on('onRemoveEntities', function(data) {
		console.log('onRemoveEntities', data);
		var entities = data.entities;
		onRemoveEntities(entities);
	});

	pomelo.on('onStand', function(data) {
		onEntityStand(data);
	});

	pomelo.on('onCloseArena', function(data) {
		console.log('onCloseArena ', data);
		onCloseArena(data);
	});

	pomelo.on('onAddChatUser', function (data) {
		console.log('onAddChatUser ', data);
		onAddUser(data.user);
	});

	pomelo.on('onLeaveChatUser', function (data) {
		console.log('onLeaveChatUser ', data);
		onRemoveUser(data.user);
	});
});

function onAddUser (user) {
	var html = '<div id="user-' + users[i].id + '" class="online-user"><span>' + users[i].name + '</span><button data-id=' + users[i].id + '>Invite</button></div>'
	$('#dialog-users').append(html);
}

function onRemoveUser (user) {
	$('#dialog-users'.remove('#user-' + user.id));
	if (!!opuser && opuser.id === user.id) {
		$('#dialog-down').text('');
		opuser = null;
	}
}

function onCloseArena (data) {
	removeArena();
}

function onEntityMove (data) {
	var entityId = data.entityId;
	var entity = arena.getEntity(entityId);
	if (!entity) {
		return;
	}
	var path = data.path;
	if (!path || path.length <= 1) {
		return;
	}

	entity.movePath(path, data.walkSpeed);
}

function onEntityAttack(data) {
	var attacker = arena.getEntity(data.attacker.entityId);
	var target = arena.getEntity(data.target.entityId);
	if (!attacker || !target) {
		return;
	}

	attacker.attack(data.attacker);

	var result = data.result.result;
	if (result === AttackResult.SUCCESS || result === AttackResult.KILLED) {
		target.update({
			damage: data.result.damage
		});
		if (result === AttackResult.KILLED) {
			target.died(data.target);
		}
	}
}

function onEntityStand(data) {
	var entityId = data.entityId;
	var entity = arena.getEntity(entityId);
	if (!entity) {
		return;
	}

	entity.stand(data);
}

function onRemoveEntities(entities) {
	for (var i = 0; i < entities.length; i++) {
		arena.removeEntity(entities[i]);
	};
}

function buildEntity(data) {
	var color = data.camp == 'enemy' ? 'green' : 'red';
	var e = new Ball({
		id: data.entityId,
		name: data.entityName,
		hp: data.hp,
		x: data.x,
		y: data.y,
		speed: data.walkSpeed,
		radius: GRID_SIZE / 2,
		color: color
	});
	return e;
}

function onAddEntities(entities) {
	for (var i = 0; i < entities.length; i++) {
		var e = buildEntity(entities[i]);
		arena.addEntity(e);
	};
}

function removeArena() {
	if (!!arena) {
		stage.removeChild(arena);
		arena = null;
	}
}

function createArena() {
	if (!!arena) {
		stage.removeChild(arena);
		arena = null;
	}

	arena = new Map(CANVAS_WIDTH, CANVAS_HEIGHT, GRID_SIZE, GRID_SIZE);
	stage.addChild(arena);
}

function connect() {
	pomelo.init({
		host: host,
		port: port,
		log: true
	}, function() {
		pomelo.request("connector.entryHandler.entry", "", function(data) {
			console.log(data);
			onConnectServer(data)
		});
	});
}

function onConnectServer(data) {
	if (data.code !== 200) {
		return;
	}

	user = data.user;
	users = data.users;
	$('#user-name').text('Your name: ' + user.name);
	showTips('Welcome ' + user.name);
}

function showTips(content) {
	$('#confirm-content').html(content);
	$('#confirm-modal').confirmModal({
		topOffset: 0,
		top: 0,
		onOkBut: function(event, el) {},
		onLoad: function(el) {},
		onClose: function(el) {}
	});
}

function createRoom () {
	$('#dialog-modal').dialogModal({
		topOffset: 0,
		top: 0,
		onDocumentClickClose : false,
		onOkBut: function(event, el, current) {},
		onCancelBut: function(event, el, current) {},
		onLoad: function(el, current) {
			$('#dialog-up').text(user.name);
			addUsers();
		},
		onClose: function(el, current) {}
	});
}

function addUsers () {
	var html = '';
	for (var i = 0; i < users.length; i++) {
		if (users[i].id === user.id) {
			continue;
		}
		html += '<div id="user-' + users[i].id + '" class="online-user"><span>' + users[i].name + '</span><button data-id=' + users[i].id + '>Invite</button></div>'
	};
	$('#dialog-users').html(html);
}