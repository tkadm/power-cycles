"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cnstGranularityShowWeight = 2.5;
exports.cnstGranularityWeight = exports.cnstGranularityShowWeight / 2;
var cnstFracDigits = 2;
function RoundGranularity(value) {
    return Math.round(value / exports.cnstGranularityWeight) * exports.cnstGranularityWeight;
}
exports.RoundGranularity = RoundGranularity;
function NumToStr(value) {
    var result = value.toString();
    var res = result.lastIndexOf(".");
    if (res == -1)
        return result + ",00";
    else
        return result.slice(0, res) + "," + (result + "00").slice(res + 1, res + 3);
}
function WeightToText(value) {
    var result = value / exports.cnstGranularityWeight;
    if ((result ^ 0) === result) {
        if (result % 2 == 0)
            return NumToStr(value);
        else
            return NumToStr(Math.floor(result / 2) * 2 * exports.cnstGranularityWeight) + "+";
    }
    else
        return NumToStr(value) + "?";
}
exports.WeightToText = WeightToText;
function CalcWeight(weight, sets) {
    var w_weight_left = weight * sets;
    var result = [];
    var i;
    for (i = 0; i < sets; i++) {
        result.push(RoundGranularity(w_weight_left / (sets - i)));
        w_weight_left -= result[i];
    }
    return result;
}
exports.CalcWeight = CalcWeight;
function CalcCycle(input_weight, steps_count, inc_func) {
    var result = [];
    var i;
    var w_weight = input_weight;
    for (i = 1; i <= steps_count; i++) {
        w_weight = inc_func(w_weight, i);
        result.push(w_weight);
    }
    return result;
}
exports.CalcCycle = CalcCycle;
//# sourceMappingURL=utilites.js.map