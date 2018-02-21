var User = require('../module/user');
var utils = require('../util/utils');
var exp = module.exports;
var gID = 0;
var gUserDict = {};

exp.newUser = function(opts) {
    var data = {
        id: ++gID,
        sid: opts.sid
    };
    var user = new User(data);
    gUserDict[user.id] = user;
    return user;
};

exp.kickOut = function(uid) {
    delete gUserDict[uid];
};

exp.getMatchUser = function(uid) {
    utils.myPrint('getMatchUser ', JSON.stringify(gUserDict));
    for (var id in gUserDict) {
        utils.myPrint(id, uid);
        if (id != uid) {
            return gUserDict[id];
        }
    }
    return null;
}