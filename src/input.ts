import { ICycleSize, IBodyWeights } from "./root";
import { CountCycleRoutine } from './utilites';

export interface IContext extends ICycleSize {
    exercises_weights: IBodyWeights;
}

export interface ICountedWeights {
    [exercise: string]: Array<number>;
}


export namespace Algorithms {
    export function Absolute(weight_step: number): CountCycleRoutine {
        return (context, step, weight) => weight + step * weight_step;
    }
    export function Procent(procent: number): CountCycleRoutine {
        return (context, step, weight) => weight + step * weight * procent / 100;
    }

    export function Absolute2dot5(): CountCycleRoutine {
        return Absolute(2.5);
    }
    export function AbsoutePlus(): CountCycleRoutine {
        return Absolute(2.5 / 2);
    }
    export function Procent2dot5(): CountCycleRoutine {
        return Procent(2.5);
    }
    export function ProcentPlus(): CountCycleRoutine {
        return Procent(2.5 / 2);
    }
}