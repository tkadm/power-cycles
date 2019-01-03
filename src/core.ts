import { IRoot, IWorkout, ICycleMain, ICycleNested } from "./root";

export enum TransformType { linear = "linear" };
export enum TransformRelativity { absolute = "absolute", procent = "procent" };
export enum NestedCycleBaseStage { prev = "prev", next = "next" }
export interface IDictionary<Type> {
    [index: string]: Type;
}

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
    let cycle: ICycleMain = root.cycles[workout.cycle];
    if (!cycle) throw "Ссылка на несуществующее в конфигурации имя цикла [" + workout.cycle + "]";
    /*    begin_cycle_level: number;
    start_date_offset: 0; */
    if (!workout.base_stage) workout.base_stage = cycle.base_stage;
    if (!workout.stage_period) workout.stage_period = cycle.stage_period;
    if (!workout.stages) workout.stages = cycle.stages;
    if (!workout.transform) workout.transform = cycle.transform; else {
        if (!workout.transform.relativity) workout.transform.relativity = cycle.transform.relativity;
        if (!workout.transform.type) workout.transform.type = cycle.transform.type;
    }
    if (!workout.nested) workout.nested = cycle.nested; else {
        let cycle_nested: ICycleNested = cycle.nested;
        let workout_nested: ICycleNested = workout.nested;
        while (cycle_nested) {

            workout_nested = workout_nested.nested;
            cycle_nested = cycle_nested.nested;
        }
    }
}