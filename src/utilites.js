module.exports.RoundGranularity = RoundGranularity;
module.exports.WeightToText = WeightToText;
module.exports.CalcWeight = CalcWeight;

module.exports.cnstGranularityShowWeight = cnstGranularityShowWeight;
module.exports.cnstGranularityWeight = cnstGranularityWeight;


var cnstGranularityShowWeight = 2.5;
var cnstGranularityWeight = cnstGranularityShowWeight / 2;
var cnstFracDigits = 2;

function RoundGranularity(value) {
    return Math.round(value / cnstGranularityWeight) * cnstGranularityWeight;
}

function NumToStr(value) {
    var result = value.toString();
    var res = result.lastIndexOf(".");
    if (res == -1)
        return result + ",00";
    else
        return result.slice(0, res) + "," + (result + "00").slice(res + 1, res + 3);
}

function WeightToText(value) {
    var result = value / cnstGranularityWeight;
    if ((result ^ 0) === result) {
        if (result % 2 == 0)
            return NumToStr(value); else
            return NumToStr(Math.floor(result / 2) * 2 * cnstGranularityWeight) + "+";
    } else return NumToStr(value) + "?";
}

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

