var character = require('../../config/data/character');

var Data = function(data) {
    var fields = {};
    data[1].forEach((key, i) => {
        fields[key] = i;
    });
    data.splice(0, 2);

    var result = {}, item;
    data.forEach(arr => {
        item = mapData(fields, arr);
        result[item.id] = item;
    });

    this.data = result;
};

var mapData = function(fields, item) {
    var obj = {};
    for (var k in fields) {
        obj[k] = item[fields[k]];
    }
    return obj;
};

Data.prototype.findById = function(id) {
    return this.data[id];
};

Data.prototype.all = function() {
    return this.data;
};

module.exports = {
    character: new Data(character)
};