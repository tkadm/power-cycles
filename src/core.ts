import { IRoot, ICycle, IWorkoutTemplate } from "./root";

export type StageSizeTransform = (index: number, weight: number) => number;
export type BaseTransform = (weight: number) => number;

export function Compute(config: IRoot, cycle_id: string, workout_id: string): any {
    let result: Array<any> = [];
    let cycle: ICycle = config.cycles[cycle_id];
    if (!cycle) throw "Недопустимый cycle_id [" + cycle_id + "]";
    let workout: IWorkoutTemplate = config.workout_templates[workout_id];
    if (!workout) throw "Недопустимый workout_id [" + workout_id + "]";
    
}