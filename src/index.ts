import * as fs from "fs";
import * as utils from "./utilites";
import { IRoot, StepValueType } from './root';
import { IContext, IExerсiseCalcParams } from "./input";



let file = fs.readFileSync(__dirname + "/../src/config.json", 'utf8');//fs.openSync(__dirname + "/config.json", "r+");
let root: IRoot = JSON.parse(file);
//console.log(root);

let exe_data: Array<IExerсiseCalcParams> = [{ exercise: "Жим", routine: utils.GetCalcCycleRoutine(100, StepValueType.absolute, 2.5) }];
let context: IContext = { weeks_length: 10, prev_max_week_num: 8, exercises_data: exe_data };
let res: string = JSON.stringify(utils.CalcCycleExes(context));

console.log(res);

//console.log(JSON.parse(file));

var zhim = [26.25, 28.125, 30, 31.875, 33.75, 35.625, 37.5];
var taga = [40, 41.875, 43.75, 45.625, 47.5, 49.375, 51, 25];
var pric = [31.25, 33.125, 35, 36.875, 38.75, 40.625, 42.5];

var result = zhim.map(value => utils.CalcExerciseSetsWeight(value, 5)).map(array => array.map(value => utils.WeightToText(value)));
//console.log(JSON.stringify(result));
