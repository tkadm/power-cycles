import { ICycleSize } from "./root";
import { CalcCycleRoutine } from './utilites';


export interface IExerсiseCalcParams {
    exercise: string;
    routine: CalcCycleRoutine;
}
export interface IContext extends ICycleSize {
    exercises_data: Array<IExerсiseCalcParams>;
}

export interface ICalculatedWeights {
    [exercise: string]: Array<number>;
}