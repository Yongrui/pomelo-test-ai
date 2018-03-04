var self;
cc.Class({
    extends: cc.Component,

    properties: {
        host: "127.0.0.1",
        port: "3010"
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        self = this;
        cc.game.addPersistRootNode(this.node);
        this.users = [];
        this.user = null;
        this.opuser = null;
    },

    start () {
        self.initHandler();
        self.connect();
    },

    onDestroy () {
        self.delHandler();
        self = null;
    },

    initHandler () {
        pomelo.on('onAddChatUser', self.onAddUser);
        pomelo.on('onLeaveChatUser', self.onRemoveUser);
    },

    delHandler () {
        pomelo.off('onAddChatUser', self.onAddUser);
        pomelo.off('onLeaveChatUser', self.onRemoveUser);
    },

    onAddUser (data) {
        var user = data.user;
        self.addUser(user);
    },

    onRemoveUser (data) {
        var user = data.user;
        self.removeUser(user.id);
    },

    connect () {
        var self = this;
        pomelo.init({
            host: self.host,
            port: self.port,
            log: true
        }, function() {
            pomelo.request("connector.entryHandler.entry", null, function(data) {
                cc.log(data);
                if (data.code !== 200) {
                    return;
                }
                self.user = data.user;
                self.users = data.users;
                self.removeUser(self.user.id);

                cc.director.preloadScene('hall', function () {
                    cc.director.loadScene('hall');
                });
            });
        });
    },

    addUser (user) {
        this.users.push(user);
    },

    removeUser (uid) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id === uid) {
                this.users.splice(i, 1);
                return;
            }
        }
    },

    getUser (uid) {
        for (var i = 0; i < this.users.length; i++) {
            if (this.users[i].id === uid) {
                return this.users[i];
            }
        }
        return null;
    },

    setEnemyUser (uid) {
        var u = this.getUser(uid);
        this.opuser = u;
    },

    getEnemyUser() {
        return this.opuser;
    }
});
