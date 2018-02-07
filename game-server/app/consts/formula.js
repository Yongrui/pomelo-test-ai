var formula = module.exports;

formula.calcDamage = function (attack, target, skill) {
	var damage = 3;

	if (damage <= 0) {
		damage = 1;
	}

	if (damage > target.hp) {
		damage = target.hp;
	}

	return Math.round(damage);
};

formula.inRange = function(origin, target, range) {
	range = range || origin.range
	var dx = origin.x - target.x;
	var dy = origin.y - target.y;
	return dx * dx + dy * dy <= range * range;
};

formula.distance = function(x1, y1, x2, y2) {
	var dx = x2 - x1;
	var dy = y2 - y1;

	return Math.sqrt(dx * dx + dy * dy);
};

formula.timeFormat = function(date) {
	var n = date.getFullYear();
	var y = date.getMonth() + 1;
	var r = date.getDate();
	var mytime = date.toLocaleTimeString();
	var mytimes = n + "-" + y + "-" + r + " " + mytime;
	return mytimes;
};