var self;
cc.Class({
    extends: cc.Component,

    properties: {
        spUserPhoto: cc.Sprite,
        labelUserName: cc.Label,
        panelInvited: cc.Node,
        labelInvitedContent: cc.Label,
        panelConfirm: cc.Node
    },

    onLoad () {
        self = this;
        self.uidInvitedFrom = null;
    },

    start () {
        self.Global = cc.find('Global');
        if (!self.Global) {
            return;
        }
        self.Global = self.Global.getComponent('Global');
        self.initUser(self.Global.user);
        self.initHandler();
    },

    onDestroy () {
        self.delHandler();
        self = null;
    },

    initUser (user) {
        var userPhoto = self.spUserPhoto.getComponent('UserPhoto');
        userPhoto.init(user.photoIdx);
        self.labelUserName.string = user.name;
    },

    initHandler () {
        pomelo.on('onBeInvited', self.onBeInvited);
        pomelo.on('onCreateArena', self.onCreateArena);
        pomelo.on('disconnect', self.onDisconnect);
    },

    delHandler () {
        pomelo.off('onBeInvited', self.onBeInvited);
        pomelo.off('onCreateArena', self.onCreateArena);
        pomelo.off('disconnect', self.onDisconnect);
    },

    onDisconnect () {
        self.panelConfirm.active = true;
    },

    onBeInvited (data) {
        self.uidInvitedFrom = data.from;
        var user = self.Global.getUser(self.uidInvitedFrom);
        if (!!user) {
            self.openInvited(user.name + '邀请你来一局！');
        }
    },

    onCreateArena (data) {
        self.closeInvited();
        self.Global.setEnemyUser(data.to);
        cc.director.preloadScene('arena', function () {
            cc.director.loadScene('arena');
        });
    },

    openInvited (msg) {
        self.labelInvitedContent.string = msg;
        self.panelInvited.active = true;
    },

    closeInvited () {
        self.panelInvited.active = false;
        self.uidInvitedFrom = null;
    },

    acceptInvited () {
        if (!!self.uidInvitedFrom) {
            pomelo.notify('arena.arenaHandler.acceptInvite', {from: self.uidInvitedFrom});
        }
        self.closeInvited();
    }
});
