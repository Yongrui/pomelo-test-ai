var consts = require('consts');

var self;
cc.Class({
    extends: cc.Component,

    properties: {
        btnFight: cc.Button,
        arena: cc.Node
    },

    onLoad () {
        self = this;
        self.arena = self.arena.getComponent('Arena');
    },

    start () {
        self.initHandler();
    },

    onDestroy () {
        self.delHandler()
        self = null;
    },

    initHandler () {
        pomelo.on('onArenaStart', self.onArenaStart);
        pomelo.on('onCloseArena', self.onArenaClose);
        pomelo.on('onStand', self.onEntityStand);
        pomelo.on('onMove', self.onEntityMove);
        pomelo.on('onAttack', self.onEntityAttack);
        pomelo.on('onAddEntities', self.onAddEntities);
        pomelo.on('onRemoveEntities', self.onRemoveEntities);
    },

    delHandler () {
        pomelo.off('onArenaStart', self.onArenaStart);
        pomelo.off('onCloseArena', self.onArenaClose);
        pomelo.off('onStand', self.onEntityStand);
        pomelo.off('onMove', self.onEntityMove);
        pomelo.off('onAttack', self.onEntityAttack);
        pomelo.off('onAddEntities', self.onAddEntities);
        pomelo.off('onRemoveEntities', self.onRemoveEntities);
    },

    fight () {
        pomelo.notify('arena.arenaHandler.start');
    },

    addEntity () {
        pomelo.notify('arena.arenaHandler.randomEntity');
    },

    onArenaStart (data) {
        cc.log('onArenaStart ', data);
        self.btnFight.active = false;
    },

    onArenaClose (data) {
        cc.log('onArenaClose ', data);
        cc.director.preloadScene('hall', function () {
            cc.director.loadScene('hall');
        });
    },

    onAddEntities (data) {
        cc.log('onAddEntities ', data);
        var entities = data.entities;
        for (var i = 0; i < entities.length; i++) {
            self.arena.addEntity(entities[i]);
        };
    },

    onRemoveEntities (data) {
        cc.log('onRemoveEntities ', data);
        var entities = data.entities;
        for (var i = 0; i < entities.length; i++) {
            self.arena.removeEntity(entities[i]);
        };
    },

    onEntityStand (data) {
        cc.log('onEntityStand ', data);
        var entityId = data.entityId;
        var entity = self.arena.getEntity(entityId);
        if (!entity) {
            return;
        }
        var node = entity.node;
        entity.stand({x2: node.x, y2: node.y, x1: data.x, y1: data.y});
    },

    onEntityMove (data) {
        cc.log('onEntityMove ', data);
        var entityId = data.entityId;
        var entity = self.arena.getEntity(entityId);
        if (!entity) {
            return;
        }
        entity.movePath(data.path, data.speed);
    },

    onEntityAttack (data) {
        cc.log('onEntityAttack ', data);
        var attacker = self.arena.getEntity(data.attacker.entityId);
        var target = self.arena.getEntity(data.target.entityId);
        if (!attacker || !target) {
            return;
        }

        var result = data.result.result;
        if (result === consts.AttackResult.SUCCESS || result === consts.AttackResult.KILLED) {
            var dir = {x1: data.attacker.x, y1: data.attacker.y, x2: data.target.x, y2: data.target.y};
            attacker.attack(dir);
            target.update({damage: data.result.damage});

            if (result === consts.AttackResult.KILLED) {
                target.died();
            }
        }
    }
});
