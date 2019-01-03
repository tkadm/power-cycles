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

export interface ICycleMain extends ICycleCommon {
    base_stage: number;
    stage_period: number;
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
    begin_cycle_level: number;
    start_date_offset: 0;
}
