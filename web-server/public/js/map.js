(function() {

function Map(width, height, tileW, tileH) {
	this.Container_constructor();

	this.mapW = width;
	this.mapH = height;
	this.tileW = tileW;
	this.tileH = tileH;
	this.startX = 0;
	this.startY = 0;
	
	this.entities = {};

	this.setup();
}
var p = createjs.extend(Map, createjs.Container);

var drawLine = function (x1, y1, x2, y2, strokeStyle, strokeColor) {
	var line = new createjs.Shape();
	line.graphics.setStrokeStyle(strokeStyle);
	line.graphics.beginStroke(strokeColor);
	line.graphics.moveTo(x1, y1);
	line.graphics.lineTo(x2, y2);
	line.graphics.endStroke();
	return line;
}

p.setup = function() {
	var row = Math.floor(this.mapH / this.tileH);
	var col = Math.floor(this.mapW / this.tileW);

	var line, x, y;
	for (var i = 0; i < row; i++) {
		x = this.startX;
		y = i * this.tileH;
		line = drawLine(x, y, x + col * this.tileW, y, 1, '#113355');
		this.addChild(line);
	}
	x = col * this.tileW;
	y = row * this.tileH;
	line = drawLine(this.startX, y, x, y, 1, '#113355');
	this.addChild(line);

	for (var j = 0; j < col; j++) {
		x = j * this.tileW;
		y = this.startY;
		line = drawLine(x, y, x, y + row * this.tileH, 1, '#113355')
		this.addChild(line);
	}
	x = col * this.tileW;
	y = row * this.tileH;
	line = drawLine(x, this.startY, x, y, 1, '#113355');
	this.addChild(line);
} ;

p.calcPosByTile = function (tx, ty) {
	return {x: this.startX + tx*this.tileW + this.tileW/2, 
		y: this.startY + ty*this.tileH + this.tileH/2};
};

p.addEntity = function (entity) {
	this.entities[entity.id] = entity;
	this.addChild(entity);
};

p.removeEntity = function (entityId) {
	var entity = this.entities[entityId];
	this.removeChild(entity);
	delete this.entities[entityId];
};

p.removeAllEntities = function() {
	for (var id in this.entities) {
		if (this.entities[id]) {
			this.removeEntity(id);
		}
	}
	this.entities = {};
};

p.getEntity = function (entityId) {
	return this.entities[entityId];
};

window.Map = createjs.promote(Map, "Container");
}());