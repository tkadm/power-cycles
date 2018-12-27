"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var utils = __importStar(require("./utilites"));
//var file = fs.readFileSync(__dirname + "/config.json", 'utf8');//fs.openSync(__dirname + "/config.json", "r+");
//console.log(file);
//console.log(JSON.parse(file));
var zhim = [26.25, 28.125, 30, 31.875, 33.75, 35.625, 37.5];
var taga = [40, 41.875, 43.75, 45.625, 47.5, 49.375, 51, 25];
var pric = [31.25, 33.125, 35, 36.875, 38.75, 40.625, 42.5];
var result = zhim.map(function (value) { return utils.CalcWeight(value, 5); }).map(function (array) { return array.map(function (value) { return utils.WeightToText(value); }); });
console.log(JSON.stringify(result));
console.log(process.execPath);
// var some = 28.125;
//# sourceMappingURL=index.js.map