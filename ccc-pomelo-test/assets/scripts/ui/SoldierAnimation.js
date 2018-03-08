var utils = require('utils');

cc.Class({
    extends: cc.Animation,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.currentAnim = 'stand';
        this.attackCallback = null;
        this.diedCallback = null;
        this.on('finished', function (event) {
            if (event.currentTarget.name === 'attack') {
                this.playStand();
                utils.invokeCallback(this.attackCallback);
            } else if (event.currentTarget.name === 'die') {
                utils.invokeCallback(this.diedCallback);
            }
        }, this);
    },

    stopWalk () {
        if (this.currentAnim === 'run') {
            this.stop('run');
            this.currentAnim = null;
        }
    },

    stopStand () {
        if (this.currentAnim === 'stand') {
            this.stop('stand');
            this.currentAnim = null;
        }
    },

    stopCheer () {
        if (this.currentAnim === 'cheer') {
            this.stop('cheer');
            this.currentAnim = null;
        }
    },

    playStand () {
        if (this.currentAnim !== 'stand') {
            this.currentAnim = 'stand';
            this.play(this.currentAnim);
        }
    },

    playRun () {
        if (this.currentAnim !== 'run') {
            this.currentAnim = 'run';
            this.play(this.currentAnim);
        }
    },

    playAttack (cb) {
        this.play('attack');
        this.attackCallback = cb;
    },

    playDie (cb) {
        this.play('die');
        this.diedCallback = cb;
    },

    playCheer () {
        if (self.currentAnim !== 'cheer') {
            this.currentAnim = 'cheer';
            this.play(this.currentAnim);
        }
    },

    isRunning () {
        return this.currentAnim === 'run';
    }
});
