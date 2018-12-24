var fs = require('fs');


var utilites = require('./utilites');

var file = fs.readFileSync(__dirname + "/config.json", 'utf8');//fs.openSync(__dirname + "/config.json", "r+");
console.log(file);
console.log(JSON.parse(file));