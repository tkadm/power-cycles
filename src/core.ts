import { IRoot, IWorkout, ICycleMain, ICycleNested, ICycleCommon, ITransform, IStartCyclePoint } from "./root";
import {
    DateCopy, DateTrunc, DaysBetween, IDictionary, NestedCycleBaseStage,
    TransformType, TransformRelativity, initialization, MainTransformRoutine, NestedTransformRoutine,
    CreateMainTransformRoutine, CreateNestedTransformRoutine
} from "./utils";

//?????????? поработать над этим
interface ComputedWorkout {
    name: string;
    level: number;
    step: number;
    weight: number;
}
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
    private initData(): void {

    }
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
    nested: ICycleNested;
    compute: MainTransformRoutine;
    Initialize(source: any): void {
        initialization.InitObject(source, this, ["nested"]);
        this.compute = CreateMainTransformRoutine(this.transform);
        let nested_init: ICycleNested = source.nested;
        let nested_owner: ICycleCommon = this;
        while (nested_init) {
            nested_owner.nested = new CycleNested();
            initialization.InitObject(nested_init, nested_owner.nested, ["nested"]);
            nested_init = nested_init.nested;
            nested_owner = nested_owner.nested;
            (nested_owner as CycleNested).compute = CreateNestedTransformRoutine(nested_owner.transform, (nested_owner as ICycleNested).base_stage);
        }
    }
}

export function ComputeWorkout(workout: IWorkout, weights: IDictionary<number>): void {
    let result: IDictionary<IDictionary<number>> = {};

}