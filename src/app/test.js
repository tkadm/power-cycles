var excel = require('excel4node');
var rxjs = require('rxjs');
var operators = require('rxjs/operators');
var fs = require('fs');

var utilites = require('./utilites');

//var wb = new excel.Workbook();

var set_per_exercie = 5;
var cycle_steps = 10;
var prev_cycle_max_result_step = 8;
var last_max_results = {
    "Жим": 10,
    "Тяга": 20,
    "Присед": 30
}


function Show(Caption, object) {
    console.log(Caption + ": " + JSON.stringify(object));
}

var first = [100, 89, 77.6, 33.33];
var second = [89, 24, 100];
var source = first;
Show("Source", source);
source = source.map(utilites.RoundGranularity);
Show("Rounded", source);
source = source.map(utilites.WeightToText);
Show("AsText", source);