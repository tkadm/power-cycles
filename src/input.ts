import { ICycleSize, IBodyWeights } from "./root";

export interface IContext extends ICycleSize {
    exercises_weights: IBodyWeights;
}

export interface ICountedWeights {
    [exercise: string]: Array<number>;
}