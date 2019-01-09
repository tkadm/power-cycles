import * as fs from "fs";
import { DateTrunc, DateCopy, InitObject } from "./utils";

// let content = fs.readFileSync(__dirname + "/../src/Data/config.json", "utf8");
// let config: IRoot = JSON.parse(content);


// let val: Date = new Date;
// let str = val.toLocaleDateString();

// val = DateTrunc(val);
// console.log(val);
// let wal = DateCopy(val, 5);
// console.log(wal);
// let res = wal.valueOf() - val.valueOf();
// res = res / (24 * 60 * 60 * 1000);
// console.log(res);

class Nested {
    id: number = 20;
}
class First {
    first: string = "first string";
}
class Second extends First {
    second: number = 4;
    subset: Nested = new Nested();
}

let source: object = { sd: "sanny", second: 5, subset: { id: "odar" } };

let val: any = new Second();


