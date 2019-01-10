import { IRoot, IWorkout, ICycleMain, ICycleNested, ITransform, IStartCyclePoint } from "./root";
import {
    DateCopy, DateTrunc, DaysBetween, IDictionary, NestedCycleBaseStage,
    TransformType, TransformRelativity, InitObject, MainTransformRoutine, NestedTransformRoutine, CreateMainTransformRoutine
} from "./utils";
class CycleNested implements ICycleNested {
    stage_periods: number[] = [3];
    base_stage: NestedCycleBaseStage = NestedCycleBaseStage.next;
    transform: ITransform = {
        type: TransformType.linear,
        relativity: TransformRelativity.procent, value: 80
    };
    nested: ICycleNested;
    compute: NestedTransformRoutine;
}
class Workout implements IWorkout {
    exercises: string[];
    cycle: string;
    stages: number = 10;
    base_stage: number = 8;
    stage_period: number = 7;
    start_cycle_point: IStartCyclePoint = { level: 0, stage: 0, days_offset: 0 };
    transform: ITransform = {
        type: TransformType.linear,
        relativity: TransformRelativity.absolute, value: 2.5
    };
    nested: ICycleNested;// = new CycleNested();
    compute: MainTransformRoutine;
    Initialize(source: any): void {
        InitObject(source, this, ["nested"]);
        this.compute = CreateMainTransformRoutine(this.transform);
        let nested: ICycleNested = this.nested;
        while (nested !== null) {

        }
    }
}

export function ComputeWorkout(workout: IWorkout, weights: IDictionary<number>): void {

}