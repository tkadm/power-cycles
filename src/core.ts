import { IRoot, ITraining, ICycleMain, ICycleNested, ICycleCommon, ITransform, IStartCyclePoint, IEndCyclePoint } from "./root";
import {
    DateCopy, DateTrunc, DaysBetween, IDictionary, INumericDictionary, NestedCycleBaseStage,
    TransformType, TransformRelativity, initialization, MainTransformRoutine, NestedTransformRoutine,
    CreateMainTransformRoutine, CreateNestedTransformRoutine
} from "./utils";
import { timingSafeEqual } from "crypto";

/**
 * "день":{
 *      "workout_name":ComputedWorkout (this below)
 * }
 */
interface IComputedTraining {
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
    constructor(public owner_training: Training) { }
    nested: ICycleNested;
    compute_proc: NestedTransformRoutine;
    calculate(level: number, prev_weight: number, next_weight: number): void {
        let w_prev_weight: number = this.compute_proc(0, prev_weight, next_weight);
        let w_weight: number;
        for (let i: number = 1; i <= this.stage_periods.length; i++) {
            w_weight = this.compute_proc(i, prev_weight, next_weight);//result!!!
            if (this.nested) this.calculate(level + 1, w_prev_weight, w_weight);
            w_prev_weight = w_weight;
        }
        w_weight = this.compute_proc(this.stage_periods.length + 1, prev_weight, next_weight);
        if (this.nested) this.calculate(level + 1, w_prev_weight, w_weight);
    }
}
class Training implements ITraining {
    private can_add_data: boolean = false;
    protected try_add_data(offset: number, training_name: string, training: IComputedTraining): void {
        if (this.can_add_data) {
            this.can_add_data == !(this.end_cycle_point && this.end_cycle_point.level > 0 &&
                this.end_cycle_point.level == training.level && this.end_cycle_point.stage == training.stage);
            this.result[offset][training_name] = training;
        } else {
            this.can_add_data = (training.level == this.start_cycle_point.level && training.stage == this.start_cycle_point.stage);
        }
    }
    end_cycle_point: IEndCyclePoint;
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
    compute_proc: MainTransformRoutine;
    result: INumericDictionary<IDictionary<IComputedTraining>>;
    Initialize(source: any): void {
        initialization.InitObject(source, this, ["nested"]);
        this.compute_proc = CreateMainTransformRoutine(this.transform);
        let nested_init: ICycleNested = source.nested;
        let nested_owner: ICycleCommon = this;
        while (nested_init) {
            nested_owner.nested = new CycleNested(this);
            initialization.InitObject(nested_init, nested_owner.nested, ["nested"]);
            nested_init = nested_init.nested;
            nested_owner = nested_owner.nested;
            (nested_owner as CycleNested).compute_proc =
                CreateNestedTransformRoutine(nested_owner.transform,
                    (nested_owner as ICycleNested).base_stage);
        }
    }
}

export function ComputeWorkout(root: IRoot, workout_name: string, weights: IDictionary<number>): void {
    this.result = {};
    for (let key in root.workouts[workout_name]) {
        let w_training_data: ITraining = root.workouts[workout_name][key];
        initialization.assign_missing_data(w_training_data, root.cycles[w_training_data.cycle]);
        let w_training: Training = new Training();
        w_training.Initialize(w_training_data);
        let w_offset: number = w_training.start_cycle_point.days_offset;
        let w_computed_training:IComputedTraining;
        for (let exercise of w_training.exercises) {
            let w_prev_weight: number = w_training.compute_proc(-w_training.base_stage, weights[exercise]);
            let w_weight: number;
            for (let i: number = 1 - w_training.base_stage; i <= w_training.stages - w_training.base_stage; i++) {
                w_weight = w_training.compute_proc(i, weights[exercise]);
                if (w_training.nested) {
                    (w_training.nested as CycleNested).calculate(1, w_prev_weight, w_weight);
                }
                //w_training.try_add_data(w_offset,key,{});
                w_prev_weight = w_weight;
            }
            w_weight = w_training.compute_proc(1 + w_training.stages - w_training.base_stage, weights[exercise]);
            if (w_training.nested) (w_training.nested as CycleNested).calculate(1, w_prev_weight, w_weight);
        }
    }
}

function InternalCompute(): void { }
