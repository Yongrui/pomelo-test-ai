cc.Class({
    extends: cc.Component,

    properties: {
        texUserPhoto: [cc.SpriteFrame]
    },

    onLoad () {
    },

    init (photoIdx) {
    	this.spUserPhoto = this.getComponent('cc.Sprite');
        this.spUserPhoto.spriteFrame = this.texUserPhoto[photoIdx];
    }
});
