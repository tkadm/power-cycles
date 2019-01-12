import { IRoot, ITraining, ICycleMain, ICycleNested, ICycleCommon, ITransform, IStartCyclePoint } from "./root";
import {
    DateCopy, DateTrunc, DaysBetween, IDictionary, INumericDictionary, NestedCycleBaseStage,
    TransformType, TransformRelativity, initialization, MainTransformRoutine, NestedTransformRoutine,
    CreateMainTransformRoutine, CreateNestedTransformRoutine
} from "./utils";

/**
 * "день":{
 *      "workout_name":ComputedWorkout (this below)
 * }
 */
interface ComputedTraining {
    level: number;
    stage: number;
    exercises: IDictionary<number>;
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
class Training implements ITraining {
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
            (nested_owner as CycleNested).compute =
                CreateNestedTransformRoutine(nested_owner.transform,
                    (nested_owner as ICycleNested).base_stage);
        }
    }
}

export function ComputeWorkout(root: IRoot, workout_name: string, weights: IDictionary<number>): void {
    let result: INumericDictionary<IDictionary<ComputedTraining>> = {};
    for (let key in root.workouts[workout_name]) {
        let w_training_data: ITraining = root.workouts[workout_name][key];
        initialization.assign_missing_data(w_training_data, root.cycles[w_training_data.cycle]);
        let w_training: Training = new Training();
        w_training.Initialize(w_training_data);
        let w_cycle_point: IStartCyclePoint = w_training.start_cycle_point;

        for (let i: number = -w_training.base_stage; i <= w_training.stages; i++) {
            for (let exercise of w_training.exercises) {
                let w_weight = weights[exercise];

            }
        }
    }
}

function InternalCompute(): void { }
