
cc.Class({
    extends: cc.Component,

    properties: {
    },

    init: function() {
        pomelo.on('onAddEntities', onAddEntities);
        pomelo.on('onRemoveEntities', onRemoveEntities);
        pomelo.on('onMove', onMove);
        pomelo.on('onAttack', onAttack);
        pomelo.on('onStand', onStand);
    },

    onAddEntities: function(data) {

    },

    onRemoveEntities: function(data) {

    },

    onMove: function(data) {

    },

    onAttack: function(data) {

    },

    onStand: function(data) {

    }

});
