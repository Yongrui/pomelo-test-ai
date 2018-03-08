var utils = require('utils');
var consts = require('consts');

cc.Class({
    extends: cc.Component,

    properties: {
        barHp: cc.ProgressBar
    },

    onLoad () {
        this.anim = this.node.getComponent('SoldierAnimation');
        this.tick = 0;
    },

    init (data) {
        this.node.x = data.x;
        this.node.y = data.y;

        if (data.camp === 'enemy') {
            this.barHp.barSprite.node.color = new cc.Color(255, 0, 0);
        }

        this.id = data.entityId;
        this.hp = data.hp;
        this.maxHp = data.hp;
        this.walkSpeed = data.walkSpeed;
        this.setHp(data.hp);

        this.curPath = null;
        this.leftDistance = 0;
        this.leftTime = 0;
    },

    faceTo (dir) {
        var dr = utils.calculateDirection(dir.x1, dir.y1, dir.x2, dir.y2);
        if (dr === consts.aniOrientation.RIGHT_UP || dr === consts.aniOrientation.RIGHT_DOWN) {
            this.node.scaleX = 1;
        } else {
            this.node.scaleX = -1;
        }
    },

    movePath (path, speed) {
        if (!speed) {
            speed = this.walkSpeed;
        }

        if (!path || path.length <= 1) {
            return;
        }

        this.stopMove();
        this.clearPath();

        this.curPath = path;
        this.leftDistance = utils.totalDistance(path);
        if(!this.leftDistance) {
            return;
        }
        this.leftTime = Math.floor(this.leftDistance / speed * 1000);

        this._movePathStep(1);
    },

    _movePathStep (index) {
        if(!this._checkPathStep(index)) {
            return;
        }

        if(index === 0) {
            index = 1;
        }

        var start = this.curPath[index - 1];
        var end = this.curPath[index];
        var distance = utils.distance(start.x, start.y, end.x, end.y);
        var time = Math.floor(this.leftTime * distance / this.leftDistance) || 1;
        var self = this;

        this._move(start.x, start.y, end.x, end.y, time, function(dt) {
            index++;
            self.leftDistance -= distance;
            self.leftTime -= dt;
            if(self.leftTime <= 0) {
                self.leftTime = 1;
            }

            if(self._checkPathStep(index)) {
                self._movePathStep(index); 
                return;
            }
            self.stopMove();
            self.clearPath();
            self.stand({x1: start.x, y1: start.y, x2: end.x, y2: end.y}, end);
        });
    },

    _move (sx, sy, ex, ey, time, cb) {
        this.stopMove();
        this.walk({x1: sx, y1: sy, x2: ex, y2: ey});
        this.node.x = sx;
        this.node.y = sy;
        var moveAction = cc.moveTo(time / 1000, cc.p(ex, ey));
        var cbAction = cc.callFunc(cb, this, time);
        this.node.runAction(cc.sequence(moveAction, cbAction));
    },

    _checkPathStep (index) {
        return this.leftDistance > 0 && this.curPath && index < this.curPath.length;
    },

    clearPath () {
        this.stopMove();
        this.curPath = null;
        this.leftDistance = 0;
        this.leftTime = 0;
    },

    stopMove () {
        this.node.stopAllActions();
    },

    walk (dir) {
        this.faceTo(dir);
        this.anim.playRun();
    },

    stand (dir, pos) {
        if (!!dir) {
            this.faceTo(dir);
        }
        this.anim.playStand();
        this.node.x = pos.x;
        this.node.y = pos.y;
    },

    attack (dir, cb) {
        this.stopMove();
        this.faceTo(dir);
        this.anim.playAttack(cb);
    },

    died (dir, cb) {
        if (!!dir) {
            this.faceTo(dir);
        }
        this.anim.playDie(cb);
    },

    setHp: function(hp) {
        this.hp = hp;
        this.barHp.progress = hp / this.maxHp;
    },

    updateHp (data) {
        var damage = data.damage || 0;
        this.setHp(this.hp - damage);
    },

    update (dt) {
        this.tick += dt;
        if (this.anim.isRunning() && this.tick > 0.3) {
            var zIndex = 1000 - Math.floor(this.node.y)
            if (zIndex !== this.node.zIndex) {
                this.tick = 0;
                this.node.zIndex = zIndex;
            }
        }
    }
});
