import * as fs from "fs";

// let content = fs.readFileSync(__dirname + "/../src/Data/config.json", "utf8");
// let config: IRoot = JSON.parse(content);


let val: Date = new Date;
let str = val.toLocaleDateString();
console.log(str);
console.log(new Date(str));