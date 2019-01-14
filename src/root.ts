import { IDictionary, TransformRelativity, TransformType, NestedCycleBaseStage } from "./utils"

export interface IRoot {
    exercises: IDictionary<string>;
    cycles: IDictionary<ICycleMain>;
    workouts: IDictionary<IDictionary<ITraining>>;
}

export interface ICycleCommon {
    transform: ITransform,
    nested: ICycleNested
}
export interface IEndCyclePoint {
    level: number;
    stage: number;
}
export interface IStartCyclePoint extends IEndCyclePoint {
    days_offset: number;
}
export interface ICycleMain extends ICycleCommon {
    stages: number,
    base_stage: number;
    stage_period: number;
    start_cycle_point: IStartCyclePoint;
    end_cycle_point: IEndCyclePoint;
}

export interface ICycleNested extends ICycleCommon {
    stage_periods: Array<number>;
    base_stage: NestedCycleBaseStage;
}

export interface ITransform {
    type: TransformType;
    relativity: TransformRelativity;
    value: number;
}

//Составной элемент Workout
export interface ITraining extends ICycleMain {
    exercises: Array<string>;
    cycle: string;
}

