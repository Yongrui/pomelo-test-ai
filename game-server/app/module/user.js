var User = function(opts) {
    this.id = opts.id;
    this.name = opts.name || ('unknown-' + this.id);
    this.sid = opts.sid;
};

module.exports = User;

User.prototype.toJSON = function() {
    return {
        id: this.id,
        sid: this.sid,
        name: this.name
    };
};