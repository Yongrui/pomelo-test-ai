var utils = require('../../../util/utils');
var userManager = require('../../../services/userManager');

module.exports = function(){
    return new UserRemote();
};

var UserRemote = function(){
};

UserRemote.prototype.newUser = function(args, cb) {
    var user = userManager.newUser(args);
    utils.invokeCallback(cb, null, user);
};

UserRemote.prototype.kickOut = function(args, cb) {
    userManager.kickOut(args.uid);
    utils.invokeCallback(cb, null, null);
};

UserRemote.prototype.match = function(args, cb) {
    var op = userManager.getMatchUser(args.uid);
    if (!op) {
        utils.invokeCallback(cb, 'no op', {code: 500});
        return;
    }
    utils.invokeCallback(cb, null, op);
};