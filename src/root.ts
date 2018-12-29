import { IDictionary } from './utilites';

export enum StepValueType { absolute = "absolute", procent = "procent" };
export enum AlgorithmType { linear = "linear" };

export interface ICycleSize {
    weeks_length: number;//>0
    prev_max_week_num: number;//начиная с 1 ( 1 <= value <= weeks_length)
}

export interface IAlgorithm {
    type: AlgorithmType;
    step_value_type: StepValueType;
}

export interface IExerciseResult {
    exercise: string;
    value: number;
    reps: number;
    date: Date;
}
export interface ICycleExerciseData {
    weight: number,
    algorithm: string,
    factor: number
}

export interface ICycle extends ICycleSize {
    name: string;
    begin_date: Date;
    exercises: IDictionary<ICycleExerciseData>
}

export interface IUser {
    caption: string;
    body_weights: IDictionary<number>;
    max_results: IExerciseResult;
    cycles: Array<ICycle>;
}

export interface IRoot {
    exercises: IDictionary<string>;
    algorithms: IDictionary<IAlgorithm>;
    users: IDictionary<IUser>;
}