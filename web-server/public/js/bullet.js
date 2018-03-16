(function () {
	function Bullet (opts) {
		this.Container_constructor();

		this.id = opts.id;
		this.map = opts.map;
		this._x = opts.x;
		this._y = opts.y;

		this.setup();
	}

	var p = createjs.extend(Bullet, createjs.Container);

	p.setup = function() {
		var circle = new createjs.Shape();
		circle.graphics.beginFill('green').drawCircle(0, 0, 5);

		this.addChild(circle);

		this.x = this._x;
		this.y = this._y;
	};

	p.fire = function (path, speed) {
		var distance = totalDistance(path);
		var time = Math.floor(distance / speed * 1000);
		var start = path[0];
		var end = path[1];
		console.log('fire ', distance, time, start, end);
		this._move(start.x, start.y, end.x, end.y, time);
	};

	p._move = function (sx, sy, ex, ey, time) {
		this.x = sx;
		this.y = sy;
		createjs.Tween.get(this).to({x: ex, y: ey}, time);
	};

	window.Bullet = createjs.promote(Bullet, "Container");
}());