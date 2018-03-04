var utils = require('../util/utils');

var User = function(opts) {
    this.id = opts.id;
    this.name = opts.name || ('unknown-' + this.id);
    this.sid = opts.sid;
    this.photoIdx = opts.photoIdx || utils.randomMN(0, 11);
};

module.exports = User;

User.prototype.toJSON = function() {
    return {
        id: this.id,
        sid: this.sid,
        name: this.name,
        photoIdx: this.photoIdx
    };
};