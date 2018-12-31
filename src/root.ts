export interface IDictionary<Type> {
    [index: string]: Type
}
export enum CycleKinds { linear = "linear" }
export enum KindRelativities { absolute = "absolute", procent = "procent" }

export interface IBaseTransform {
    relativity: KindRelativities;
    parameter: number
}
export interface IStageSizeTransform {
    kind: CycleKinds;
    relativity: KindRelativities;
    parameter: number
}
export interface ICycle {
    length_steps: number,
    base_step: number,
    base_transform: IBaseTransform;
    stage_size_transform: IStageSizeTransform;
    nested: ICycle;
}
export interface IWorkoutContent {
    caption: string;
    offset: number;
    exercise_cycles: IDictionary<number>;
}
export interface IWorkoutTemplate {
    length_days: number;
    workouts: IDictionary<IWorkoutContent>
}
export interface IRoot {
    exercises: IDictionary<string>;
    cycles: IDictionary<ICycle>;
    workout_templates: IDictionary<IWorkoutTemplate>;
}