export enum StepValueType { absolute = "absolute", procent = "procent" };
export enum AlgorithmType { linear = "linear" };

export interface ICycleSize {
    weeks_length: number;//>0
    prev_max_week_num: number;//начиная с 1 ( 1 <= value <= weeks_length)
}

export interface IExercises {
    [index: string]: string;
}
export interface IAlgorithm {
    type: AlgorithmType;
    step_value_type: StepValueType;
}
export interface IAlgorithms {
    [index: string]: IAlgorithm;
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
export interface ICycleExercises {
    [index: string]: ICycleExerciseData
}
export interface ICycle extends ICycleSize {
    name: string;
    begin_date: Date;
    exercises: ICycleExercises
}
export interface IBodyWeights {
    [index: string]: number;
}
export interface IUser {
    caption: string;
    body_weights: IBodyWeights;
    max_results: IExerciseResult;
    cycles: Array<ICycle>;
}
export interface IUsers {
    [index: string]: IUser;
}
export interface IRoot {
    exercises: IExercises;
    algorithms: IAlgorithms;
    users: IUsers;
}