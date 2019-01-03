import { IRoot, IWorkout, ICycleMain, ICycleNested, ITransform } from "./root";

export enum TransformType { linear = "linear" };
export enum TransformRelativity { absolute = "absolute", procent = "procent" };
export enum NestedCycleBaseStage { prev = "prev", next = "next" }
export interface IDictionary<Type> {
    [index: string]: Type;
}
export type MainTransformRoutine = (index: number, base_weight: number) => number;
export type NestedTransformRoutine = (index: number, prev_weight: number, next_weight: number) => number;


export interface IInput {
    date_begin: Date;
    workout_set: string;
}

export interface IWorkoutDayTask {
    date: Date;
    weights: IDictionary<number>;
}

export function ComputeWorkouts(input: IInput, root: IRoot): Array<IWorkoutDayTask> {
    let result: Array<IWorkoutDayTask> = [];
    let wo_dic: IDictionary<IWorkout> = root.workouts[input.workout_set];
    for (let wo_name in wo_dic) {
        let wo: IWorkout = wo_dic[wo_name];
        NormilizeWorkout(wo, root);

    }
    return result;
}

function NormilizeWorkout(workout: IWorkout, root: IRoot): void {
    if (!workout.cycle) return;
    let cycle: ICycleMain | ICycleNested = root.cycles[workout.cycle];
    if (!cycle) throw "Ссылка на несуществующее в конфигурации имя цикла [" + workout.cycle + "]";
    if (!workout.base_stage) workout.base_stage = cycle.base_stage;
    if (!workout.stage_period) workout.stage_period = cycle.stage_period;
    if (!workout.stages) workout.stages = cycle.stages;
    if (!workout.transform) workout.transform = cycle.transform; else {
        if (!workout.transform.relativity) workout.transform.relativity = cycle.transform.relativity;
        if (!workout.transform.type) workout.transform.type = cycle.transform.type;
    }
    if (!workout.nested) workout.nested = cycle.nested; else {
        cycle = cycle.nested;
        let workout_nested: ICycleNested = workout.nested;
        while (cycle) {
            if (!workout_nested.base_stage) workout_nested.base_stage = cycle.base_stage;
            if (!workout_nested.stage_periods) workout_nested.stage_periods = cycle.stage_periods;
            if (!workout_nested.stages) workout_nested.stages = cycle.stages;
            if (!workout_nested.transform) workout_nested.transform = cycle.transform; else {
                if (!workout_nested.transform.relativity) workout_nested.transform.relativity = cycle.transform.relativity;
                if (!workout_nested.transform.type) workout_nested.transform.type = cycle.transform.type;
            }
            if (!workout_nested.nested) {
                workout_nested.nested = cycle.nested;
                break;
            }
            workout_nested = workout_nested.nested;
            cycle = cycle.nested;
        }
    }
}
function CreateMainTransformRoutine(transform:ITransform): MainTransformRoutine {

}