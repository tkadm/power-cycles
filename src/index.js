var fs = require('fs');


var utilites = require('./utilites');

var file = fs.openSync(__dirname + "/config.json", "r+");
console.log(file);