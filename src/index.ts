console.log("hello!");

let fun:Function = new Function("a","b","console.log(a+b+'do it!')");

fun("One ", "Two ");