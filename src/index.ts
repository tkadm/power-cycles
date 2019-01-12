import * as fs from "fs";
import { DateTrunc, DateCopy, initialization } from "./utils";

// let content = fs.readFileSync(__dirname + "/../src/Data/config.json", "utf8");
// let config: IRoot = JSON.parse(content);


let val: Date = new Date;
let str = val.toLocaleDateString();
console.log(str);
// val = DateTrunc(val);
// console.log(val);
// let wal = DateCopy(val, 5);
// console.log(wal);
// let res = wal.valueOf() - val.valueOf();
// res = res / (24 * 60 * 60 * 1000);
// console.log(res);




