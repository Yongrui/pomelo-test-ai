
cc.Class({
    extends: cc.Component,

    properties: {
        prefabInfantry: cc.Prefab,
        prefabCavalry: cc.Prefab,
        scene: cc.Node
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.entities = {};
    },

    onDestroy () {
        this.entities = null;
    },

    addEntity (data) {
        var e;
        if (data.kindId === 101) {
            e = cc.instantiate(this.prefabInfantry);
        } else if (data.kindId === 201) {
            e = cc.instantiate(this.prefabCavalry);
        }
        if (!e) {
            return;
        }
        var soldier = e.getComponent('Soldier');
        soldier.init(data);
        this.scene.addChild(e);
        this.entities[soldier.id] = e;
    },

    removeEntity (entityId) {
        var e = this.entities[entityId];
        if (!e) {
            return;
        }
        this.scene.removeChild(e);
        delete this.entities[entityId];
    },

    getEntity (entityId) {
        var e = this.entities[entityId];
        if (!e) {
            return null;
        }
        return e.getComponent('Soldier');
    }
});
