import { IDictionary, TransformRelativity, TransformType, NestedCycleBaseStage } from "./core"

export interface IRoot {
    exercises: IDictionary<string>;
    cycles: IDictionary<ICycleMain>;
    workouts: IDictionary<IDictionary<IWorkout>>;
}

interface ICycleCommon {
    stages: number,
    transform: ITransform,
    nested: ICycleNested
}
export interface IStartCyclePoint {
    days_offset: number;
    level: number;
    stage: number;
}
export interface ICycleMain extends ICycleCommon {
    base_stage: number;
    stage_period: number;
    start_cycle_point: IStartCyclePoint;
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

export interface IWorkout extends ICycleMain {
    exercises: Array<string>;
    cycle: string;
}

