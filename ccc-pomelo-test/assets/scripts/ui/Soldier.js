var utils = require('utils');
var consts = require('consts');

cc.Class({
    extends: cc.Component,

    properties: {
        anim: cc.Animation,
        barHp: cc.ProgressBar
    },

    onLoad () {
        this.currentAnim = 'stand';
        this.attackCallback = null;

        this.anim.on('finished', function (event) {
            if (event.currentTarget.name === 'attack') {
                this.playStand();
                utils.invokeCallback(this.attackCallback);
            } else if (event.currentTarget.name === 'die') {
                utils.invokeCallback(this.diedCallback);
            }
        }, this);
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

        this.moveAction = null;

        this.curPath = null;
        this.leftDistance = 0;
        this.leftTime = 0;
    },

    update (data) {
        var damage = data.damage || 0;
        this.setHp(this.hp - damage);
    },

    faceTo (dir) {
        var dr = utils.calculateDirection(dir.x1, dir.y1, dir.x2, dir.y2);
        if (dr === consts.aniOrientation.RIGHT_UP || dr === consts.aniOrientation.RIGHT_DOWN) {
            this.node.scaleX = 1;
        } else {
            this.node.scaleX = -1;
        }
    },

    walk (dir) {
        // this.stopWholeAnimations();
        this.faceTo(dir);
        this.playRun();
    },

    stand (dir) {
        // this.stopWholeAnimations();
        if (!!dir) {
            this.faceTo(dir);
        }
        this.playStand();
    },

    attack (dir, cb) {
        // this.stopWholeAnimations();
        this.faceTo(dir);
        this.playAttack();
        this.node.x = dir.x1;
        this.node.y = dir.y1;
        this.attackCallback = cb;
    },

    died (dir, cb) {
        // this.stopWholeAnimations();
        if (!!dir) {
            this.faceTo(dir);
        }
        this.playDie();
        this.diedCallback = cb;
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
        cc.log('move path ', distance, time, self.leftDistance, self.leftTime, self.walkSpeed);

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
            self.stand({x1: start.x, y1: start.y, x2: end.x, y2: end.y});
        });
    },

    _move (sx, sy, ex, ey, time, cb) {
        this.stopMove();
        this.walk({x1: sx, y1: sy, x2: ex, y2: ey});
        this.node.x = sx;
        this.node.y = sy;
        this.moveAction = cc.moveTo(time / 1000, cc.p(ex, ey));
        var cbAction = cc.callFunc(cb, this, time);
        this.node.runAction(cc.sequence(this.moveAction, cbAction));
        cc.log('move ', sx, sy, ex, ey, time);
    },

    _checkPathStep (index) {
        return this.leftDistance > 0 && this.curPath && index < this.curPath.length;
    },

    clearPath () {
        // this.stopMove();
        this.curPath = null;
        this.leftDistance = 0;
        this.leftTime = 0;
    },

    stopWholeAnimations () {
        this.stopMove();
        this.stopStand();
        this.stopAttack();
        this.stopCheer();
        this.stopDie();
    },

    stopMove () {
        // if (!!this.moveAction) {
        //     this.node.stopAction(this.moveAction);
        //     this.moveAction = null;
        // }
        this.node.stopAllActions();
        // this.stopWalk();
    },

    stopWalk () {
        this.anim.stop('run');
    },

    stopStand () {
        this.anim.stop('stand');
    },

    stopAttack () {
        this.anim.stop('attack');
    },

    stopCheer () {
        this.anim.stop('cheer');
    },

    stopDie () {
        this.anim.stop('die');
    },

    playStand: function() {
        if (this.currentAnim !== 'stand') {
            cc.log('playStand !!!!');
            this.currentAnim = 'stand';
            this.anim.play(this.currentAnim);
        }
    },

    playRun: function() {
        if (this.currentAnim !== 'run') {
            cc.log('playRun !!!!');
            this.currentAnim = 'run';
            this.anim.play(this.currentAnim);
        }
    },

    playAttack: function() {
        this.anim.play('attack');
    },

    playDie: function() {
        this.anim.play('die');
    },

    playCheer: function() {
        if (self.currentAnim !== 'cheer') {
            this.currentAnim = 'cheer';
            this.anim.play(this.currentAnim);
        }
    },

    setHp: function(hp) {
        this.hp = hp;
        this.barHp.progress = hp / this.maxHp;
    }
});
