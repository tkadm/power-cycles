var fs = require('fs');
var ut = require('./utilites');

var utilites = require('./utilites');

var file = fs.readFileSync(__dirname + "/config.json", 'utf8');//fs.openSync(__dirname + "/config.json", "r+");
//console.log(file);
//console.log(JSON.parse(file));

var zhim = [26.25, 28.125, 30, 31.875, 33.75, 35.625, 37.5];
var taga = [40, 41.875, 43.75, 45.625, 47.5, 49.375, 51, 25];
var pric = [31.25, 33.125, 35, 36.875, 38.75, 40.625, 42.5];

var result = zhim.map(value=>ut.CalcWeight(value,5)).map(array=>array.map(value=>ut.WeightToText(value)));
console.log(JSON.stringify(result));
// var some = 28.125;
// console.log(ut.RoundGranularity(some));
// console.log(ut.WeightToText(ut.RoundGranularity(some)));