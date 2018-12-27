export const cnstGranularityShowWeight = 2.5;
export const cnstGranularityWeight = cnstGranularityShowWeight / 2;
const cnstFracDigits = 2;

export function RoundGranularity(value: number): number {
    return Math.round(value / cnstGranularityWeight) * cnstGranularityWeight;
}

function NumToStr(value: number): string {
    var result = value.toString();
    var res = result.lastIndexOf(".");
    if (res == -1)
        return result + ",00";
    else
        return result.slice(0, res) + "," + (result + "00").slice(res + 1, res + 3);
}

export function WeightToText(value: number, make_rounded: boolean = false): string {
    let result: number;
    if (make_rounded)
        result = RoundGranularity(value) / cnstGranularityWeight;
    else
        result = value / cnstGranularityWeight;
    if ((result ^ 0) === result) {
        if (result % 2 == 0)
            return NumToStr(value); else
            return NumToStr(Math.floor(result / 2) * 2 * cnstGranularityWeight) + "+";
    } else return NumToStr(value) + "?";
}

export function CalcExerciseSetsWeight(weight: number, sets: number): Array<number> {
    let w_weight_left: number = weight * sets;
    let result: Array<number> = [];
    let i: number;
    for (i = 0; i < sets; i++) {
        result.push(RoundGranularity(w_weight_left / (sets - i)));
        w_weight_left -= result[i];
    }
    return result;
}

export function CalcCycle(input_weight: number, steps_count: number, inc_func: (weight: number, counter: number) => number): Array<number> {
    let result: Array<number> = [];
    let i: number;
    for (i = 0; i < steps_count; i++) {
        if (i == 0) result.push(input_weight);
        else result.push(inc_func(result[i - 1], i));
    }
    return result;
}

export function DateToString(value: Date): string {
    let nm: number = value.getMonth();
    return ("0" + value.getDate()).slice(-2) + "." + ("0" + (1 + value.getMonth())).slice(-2) + "." + value.getFullYear();
}