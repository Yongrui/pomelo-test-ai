// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

cc.Class({
    extends: cc.Component,

    properties: {
        labelUserName: cc.Label,
        labelUserState: cc.Label,
        spUserPhoto: cc.Sprite,
        texUserPhoto: [cc.SpriteFrame]
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    init (userInfo) {
        this.userInfo = userInfo;
        this.labelUserName.string = userInfo.name;
        this.labelUserState.string = userInfo.state === 0 ? '空闲中' : '游戏中';
        this.userPhoto = this.spUserPhoto.node.getComponent('UserPhoto');
        this.userPhoto.init(userInfo.photoIdx);
    },

    invite () {
        var msg = {opuid: this.userInfo.id, opsid: this.userInfo.sid};
        pomelo.request('arena.arenaHandler.invite', msg, function(data) {
            cc.log('arenaHandler.invite ', data);
        });
    }

    // update (dt) {},
});
