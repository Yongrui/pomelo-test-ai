var self;
cc.Class({
    extends: cc.Component,

    properties: {
        scrollView: cc.ScrollView,
        prefabRankItem: cc.Prefab
    },

    onLoad () {
        self = this;
        self.userItemList = {};
        self.content = self.scrollView.content;
    },

    start () {
        self.Global = cc.find('Global');
        if (!self.Global) {
            return;
        }
        self.Global = self.Global.getComponent('Global');
        self.initHandler();
        self.populateList(self.Global.users);
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

    populateList (userList) {
        for (var i = 0; i < userList.length; i++) {
            var userInfo = userList[i];
            self.pushUserItem(userInfo);
        }
    },

    pushUserItem (userInfo) {
        var item = cc.instantiate(self.prefabRankItem);
        item.getComponent('UserItem').init(userInfo);
        self.content.addChild(item);
        self.userItemList[userInfo.id] = item;
    },

    removeUserItem (uid) {
        var item = self.userItemList[uid];
        item.destroy();
        self.userItemList[uid] = null;
    },

    onAddUser (data) {
        var user = data.user;
        self.pushUserItem(user);
    },

    onRemoveUser (data) {
        var user = data.user;
        self.removeUserItem(user.id);
    }
});
