export enum StepValueType { absolute = "absolute" };
export enum AlgorithmType { linear = "linear" };

export interface IExercises {
    [index: string]: string;
}
export interface IAlgorithm {
    type: AlgorithmType;
    step_value_type: StepValueType;
    value: number;
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
export interface ICycle {
    name: string;
    begin_date: Date;
    weeks_length: number;
    prev_max_week_num: number;
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
    algorithms: IAlgorithm;
    users: IUsers;
}