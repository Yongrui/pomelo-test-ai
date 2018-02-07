(function() {

	function Ball(opts) {
		this.Container_constructor();

		this.id = opts.id;
		this.color = opts.color;
		this.label = opts.hp;
		this.radius = opts.radius;
		this.map = opts.map;

		this.tx = 0;
		this.ty = 0;

		this.setup();
	}
	var p = createjs.extend(Ball, createjs.Container);

	p.setup = function() {
		var circle = new createjs.Shape();
		circle.graphics.beginFill(this.color).drawCircle(0, 0, this.radius);

		var text = new createjs.Text(this.label, "10px Arial", "#fff");
		// text.textBaseline = "top";
		text.textAlign = "center";

		this.addChild(circle, text);
	};

	p.setTilePos = function(tx, ty) {
		this.tx = tx;
		this.ty = ty;
		var pos = this.map.calcPosByTile(tx, ty);
		this.set(pos);
	};

	p.getTilePos = function() {
		return {
			tx: this.tx,
			ty: this.ty
		};
	};

	window.Ball = createjs.promote(Ball, "Container");
}());
