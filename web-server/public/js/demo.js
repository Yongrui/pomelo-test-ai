(function(argument) {


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

	$('#inviteUser').click(function () {
		createRoom();
	});
	$('#startArena').click(function() {
		start();
	});
	$('#addEntity').click(function() {
		randomEntity();
	});
	$('#startArena').hide();
	$('#addEntity').hide();

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

	pomelo.on('onBeInvited', function(data) {
		console.log('onBeInvited ', data);
		onBeInvited(data.from);
	});

	pomelo.on('onCreateArena', function(data) {
		console.log('onCreateArena ', data);
		onCreateArena(data);
	});
});

function randomEntity() {
	pomelo.notify('arena.arenaHandler.randomEntity');
}

function start() {
	pomelo.notify('arena.arenaHandler.start');
}

function onBeInvited(uid) {
	var u = getUser(uid);
	if (!!u) {
		showTips('Invited from ' + u.name, function(argument) {
			pomelo.notify('arena.arenaHandler.acceptInvite', {from: uid});
		});
	}
}

function onAddUser (user) {
	users.push(user);
	var html = '<div class="online-user user-' + user.id + '"><span>' + user.name + '</span><button data-id=' + user.id + '>Invite</button></div>'
	$('.dialog-users').append(html);
	initInviteClick();
}

function onRemoveUser (user) {
	var cla = '.user-' + user.id;
	$(cla).remove(cla);
	initInviteClick();
	for (var i = 0; i < users.length; i++) {
		if (users[i].id === user.id) {
			users.splice(i, 1);
			return;
		}
	}
}

function onCreateArena(data) {
	var user1 = getUser(data.from);
	var user2 = getUser(data.to);
	if (!!user1 && !!user2) {
		closeModal();
		createArena();
		$('#inviteUser').hide();
		$('#user-name').text(user1.name + ' vs ' + user2.name);
		$('#startArena').show();
		$('#addEntity').show();
	}
}

function onCloseArena (data) {
	removeArena();
	$('#inviteUser').show();
	$('#user-name').text(user.name);
	$('#startArena').hide();
	$('#addEntity').hide();
}

function onEntityMove (data) {
	if (!arena) {
		return;
	}
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
	if (!arena) {
		return;
	}
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
	if (!arena) {
		return;
	}
	var entityId = data.entityId;
	var entity = arena.getEntity(entityId);
	if (!entity) {
		return;
	}

	entity.stand(data);
}

function onRemoveEntities(entities) {
	if (!arena) {
		return;
	}
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
	if (!arena) {
		return;
	}
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

function showTips(content, okcb) {
	$('.confirm-content').text(content);
	$('#confirm-modal').dialogModal({
		onOkBut: function(event, el) {
			if (!!okcb) {
				okcb(event, el);
			}
		},
		onCancelBut: function(event, el, current) {},
		onLoad: function(el) {
		},
		onClose: function(el) {}
	});
}

function closeModal() {
	$('#dialog-modal').dialogModal('hide');
	$('#confirm-modal').dialogModal('hide');
}

function createRoom () {
	addUsers();
	$('#dialog-modal').dialogModal({
		onOkBut: function(event, el, current) {},
		onCancelBut: function(event, el, current) {},
		onLoad: function(el, current) {
			initInviteClick();
		},
		onClose: function(el, current) {}
	});
}

function initInviteClick() {
	$('.online-user button').click(function() {
		var uid = $(this).data('id');
		var u = getUser(uid);
		if (!u) {
			return;
		}
		pomelo.request('arena.arenaHandler.invite', {opuid: u.id, opsid: u.sid}, function(data) {
			console.log('arenaHandler.invite ', data);
			if (data.code !== 200) {
				showTips('ERROR');
			}
		});
	});
}

function addUsers () {
	var html = '';
	for (var i = 0; i < users.length; i++) {
		if (users[i].id === user.id) {
			continue;
		}
		html += '<div class="online-user user-' + users[i].id + '"><span>' + users[i].name + '</span><button data-id=' + users[i].id + '>Invite</button></div>'
	};
	$('.dialog-users').html(html);
}

function getUser(uid) {
	for (var i = 0; i < users.length; i++) {
		if (users[i].id === uid) {
			return users[i];
		}
	}
	return null;
}

})()