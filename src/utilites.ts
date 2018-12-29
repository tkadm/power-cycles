import { IContext, ICalculatedWeights } from "./input";
import { StepValueType } from './root';

export type CalcCycleRoutine = (step: number) => number;

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

export function CalcCycleExes(context: IContext): ICalculatedWeights {
    let result: ICalculatedWeights = {};
    for (let w_exe of context.exercises_data) {
        result[w_exe.exercise] = [];
        for (let i = 1; i <= context.weeks_length; i++)
            result[w_exe.exercise].push(w_exe.routine(i - context.prev_max_week_num));
    }
    return result;
}

export function DateToString(value: Date): string {
    let nm: number = value.getMonth();
    return ("0" + value.getDate()).slice(-2) + "." + ("0" + (1 + value.getMonth())).slice(-2) + "." + value.getFullYear();
}

export function GetCalcCycleRoutine(base_weight: number, factor: number = 2.5, SV_type: StepValueType = StepValueType.absolute): CalcCycleRoutine {
    let result: CalcCycleRoutine;
    switch (SV_type) {
        case StepValueType.absolute: result = step => base_weight + step * factor; break;
        case StepValueType.procent: result = step => base_weight + step * base_weight * factor / 100; break;
        default: throw new Error("Unknown Step-Value type!");
    }
    return result;
}