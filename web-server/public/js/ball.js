(function() {

	function Ball(opts) {
		this.Container_constructor();

		this.id = opts.id;
		this.color = opts.color;
		this.hp = opts.hp;
		this.radius = opts.radius;
		this.map = opts.map;
		this.name = opts.name;

		this._x = opts.x;
		this._y = opts.y;
		this.speed = opts.speed;

		this.setup();
	}
	var p = createjs.extend(Ball, createjs.Container);

	p.setup = function() {
		var circle = new createjs.Shape();
		circle.graphics.beginFill(this.color).drawCircle(0, 0, this.radius);

		var text = new createjs.Text(this.hp, "10px Arial", "#fff");
		// text.textBaseline = "top";
		text.textAlign = "center";
		this.hpText = text;

		var text1 = new createjs.Text(this.name, "10px Arial", "#000");
		text1.textBaseline = "top";
		text1.textAlign = "center";
		text1.y = -10;

		this.addChild(circle, text, text1);

		this.x = this._x;
		this.y = this._y;
	};

	p.movePath = function (path, speed) {
		if (!speed) {
			speed = this.speed;
		}
		this.stopWholeAnimations();
		this.clearPath();

		this.curPath = path;
		this.leftDistance = totalDistance(path);
		if(!this.leftDistance) {
			return;
		}
		this.leftTime = Math.floor(this.leftDistance / speed * 1000);
		this._movePathStep(1);
	};

	p.clearPath = function () {
		// this.curPath = null;
		this.leftDistance = 0;
		this.leftTime = 0;
	};

	p.stopWholeAnimations = function () {
		this.stopMove();
	};

	p.stopMove = function () {
		createjs.Tween.removeTweens(this);
	};

	p._movePathStep = function (index) {
		if(!this._checkPathStep(index)) {
			return;
		}

		if(index === 0) {
			index = 1;
		}

		var start = this.curPath[index - 1];
		var end = this.curPath[index];
		var dist = distance(start.x, start.y, end.x, end.y);
		var time = Math.floor(this.leftTime * dist / this.leftDistance) || 1;
		var self = this;

		this._move(start.x, start.y, end.x, end.y, time, function (dt) {
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

			self.stopWholeAnimations();
			self.clearPath();
		});
	};

	p._checkPathStep = function (index) {
		return this.leftDistance > 0 && this.curPath && index < this.curPath.length;
	};

	p._move = function (sx, sy, ex, ey, time, cb) {
		this.stopMove();

		this.x = sx;
		this.y = sy;
		createjs.Tween.get(this).to({x: ex, y: ey}, time).call(cb, [time], this);
	};

	p.attack = function () {
		this.stopWholeAnimations();
		this.clearPath();
	};

	p.died = function () {
		this.stopWholeAnimations();
		this.clearPath();
	};

	p.update = function(data) {
		this.hp -= data.damage;
		if (this.hpText) {
			this.hpText.text = this.hp;
		}
	};

	p.stand = function(data) {
		this.stopMove();
		this.clearPath();
		this.x = data.x;
		this.y = data.y;
	};

	window.Ball = createjs.promote(Ball, "Container");
}());
