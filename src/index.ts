import * as fs from "fs";
import { IRoot } from "./root";
import { Compute } from "./core";

let content = fs.readFileSync(__dirname + "/../src/Data/config.json", "utf8");
let config: IRoot = JSON.parse(content);

Compute(config,"standard","a-template");
