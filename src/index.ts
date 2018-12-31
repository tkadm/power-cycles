import * as fs from "fs";
import { IRoot, IDictionary } from "./root";
import { Compute, IComputeData } from "./core";

let content = fs.readFileSync(__dirname + "/../src/Data/config.json", "utf8");
let config: IRoot = JSON.parse(content);

let exes: IDictionary<number> = { exeA: 100, exeB: 105, exeC: 90 };
let source: IComputeData = { cycle_id: "standard", exe_weights: exes, workout_id: "a-template" };
let res = Compute(config, source);

console.log(JSON.stringify(res));

