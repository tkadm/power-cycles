import { IRoot, IWorkout, ICycleMain, ICycleNested, ITransform } from "./root";
import { DateCopy, DateTrunc, DaysBetween } from "./utils";
import { textSpanContainsTextSpan } from "typescript";

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
    weights: IDictionary<number>;
}

// export interface IWorkoutDayTask {
//     date: Date;
//     weights: IDictionary<number>;
// }
class ComputeContext {
    private _workout: IWorkout;
    can_assign: boolean;
    routineMain: MainTransformRoutine;
    routinesNested: Array<NestedTransformRoutine>;
    current_date: Date;
    get workout(): IWorkout {
        return this._workout;
    }
    constructor() { this.can_assign = false; }
    assign_workout(workout: IWorkout, root: IRoot) {
        NormilizeWorkout(workout, root);
        this._workout = workout;
        this.routineMain = CreateMainTransformRoutine(this._workout.transform);
        this.routinesNested = CreateTransformRoutineArray(this._workout.nested);
    }
    starts_with_main_cycle(): boolean {
        return (!this._workout.start_cycle_point || this._workout.start_cycle_point.level == 0);
    }
}
interface INestedContext {
    level: number;
    prev_weight?: number;
    next_weight: number;
    cycle: ICycleNested;
    context: ComputeContext;
    exercise: string;
}
export function ComputeWorkouts(input: IInput, root: IRoot): IDictionary<IDictionary<number>> {
    let result: IDictionary<IDictionary<number>> = {};
    let wo_dic: IDictionary<IWorkout> = root.workouts[input.workout_set];
    for (let wo_name in wo_dic) {
        let context: ComputeContext = new ComputeContext();
        context.assign_workout(wo_dic[wo_name], root);
        context.current_date = input.date_begin;
        if (!context.starts_with_main_cycle()) {
            for (let w_exe in context.workout.exercises) {
                if (DaysBetween(AssignNestedCycles({
                    exercise: w_exe,
                    cycle: context.workout.nested, level: 1,
                    prev_weight: null,
                    next_weight: context.routineMain(-context.workout.base_stage, input.weights[w_exe]),
                    context: context
                }, result), context.current_date) > context.workout.stage_period)
                    throw "Вложенный цикл длиннее внешнего";
            }
        }
        for (let i = 0; i < context.workout.stages; i++) {
            for (let w_exe in context.workout.exercises) {
                //result.push({});
            }
        }
    }
    return result;
}
function AssignNestedCycles(context: INestedContext, result: IDictionary<IDictionary<number>>): Date {
    if (!context.cycle) return;
    let prev_weight: number = context.prev_weight;
    let current_date: Date = DateCopy(context.context.current_date, 0);
    for (let i = 0; i < context.cycle.stage_periods.length; i++) {
        if (context.level == context.context.workout.start_cycle_point.level &&
            i == context.context.workout.start_cycle_point.stage) context.context.can_assign = true;
        current_date = DateCopy(current_date, context.cycle.stage_periods[i]);
        prev_weight = context.context.routinesNested[context.level - 1](i, context.prev_weight, context.next_weight);
        if (context.context.can_assign) {
            if (!result[current_date.toLocaleDateString()]) result[current_date.toLocaleDateString()] = {};
            result[current_date.toLocaleDateString()][context.exercise] = prev_weight;
        }
        AssignNestedCycles({
            exercise: context.exercise,
            context: context.context,
            cycle: context.cycle.nested, level: context.level + 1,
            prev_weight: prev_weight,
            next_weight: context.context.routinesNested[context.level - 1](i + 1, context.prev_weight, context.next_weight)
        }, result);
    }
    return current_date;
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
        if (!workout.transform.value) workout.transform.value = cycle.transform.value;
    }
    if (!workout.start_cycle_point) workout.start_cycle_point = cycle.start_cycle_point; else {
        if (!workout.start_cycle_point.days_offset)
            workout.start_cycle_point.days_offset = cycle.start_cycle_point.days_offset;
        if (!workout.start_cycle_point.level)
            workout.start_cycle_point.level = cycle.start_cycle_point.level;
        if (!workout.start_cycle_point.stage)
            workout.start_cycle_point.stage = cycle.start_cycle_point.stage;
    }
    if (!workout.start_cycle_point) workout.start_cycle_point = { level: 0, days_offset: 0, stage: 0 };
    if (!workout.nested) workout.nested = cycle.nested; else {
        cycle = cycle.nested;
        let workout_nested: ICycleNested = workout.nested;
        while (cycle) {
            if (!workout_nested.base_stage) workout_nested.base_stage = cycle.base_stage;
            if (!workout_nested.stage_periods) workout_nested.stage_periods = cycle.stage_periods;
            if (!workout_nested.transform) workout_nested.transform = cycle.transform; else {
                if (!workout_nested.transform.relativity) workout_nested.transform.relativity = cycle.transform.relativity;
                if (!workout_nested.transform.type) workout_nested.transform.type = cycle.transform.type;
                if (!workout_nested.transform.value) workout_nested.transform.value = cycle.transform.value;
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
function CreateMainTransformRoutine(transform: ITransform): MainTransformRoutine {
    let result: MainTransformRoutine;
    switch (transform.type) {
        case TransformType.linear:
            switch (transform.relativity) {
                case TransformRelativity.absolute:
                    result = (index, weight) => weight + index * transform.value
                    break;
                case TransformRelativity.procent:
                    result = (index, weight) => weight + index * weight * transform.value / 100;
                    break;
            }
            break;
        default: throw "Неизвестный TransormType [" + transform.type + "]";
    }
    return result;
}
function CreateNestedTransformRoutine(transform: ITransform, nested_base_stage: NestedCycleBaseStage): NestedTransformRoutine {
    let result: NestedTransformRoutine;
    switch (transform.type) {
        case TransformType.linear:
            switch (transform.relativity) {
                case TransformRelativity.absolute:
                    switch (nested_base_stage) {
                        case NestedCycleBaseStage.next:
                            result = (index, prev_weight, next_weight) => next_weight + index * transform.value;
                            break;
                        case NestedCycleBaseStage.prev:
                            result = (index, prev_weight, next_weight) => prev_weight + index * transform.value;
                            break;
                        default: throw "Неизвестное значение nested_base_stage [" + nested_base_stage + "]";
                    }
                    break;
                case TransformRelativity.procent:
                    switch (nested_base_stage) {
                        case NestedCycleBaseStage.next:
                            result = (index, prev_weight, next_weight) =>
                                next_weight + index * next_weight * transform.value / 100;
                            break;
                        case NestedCycleBaseStage.prev:
                            result = (index, prev_weight, next_weight) =>
                                prev_weight + index * prev_weight * transform.value / 100;
                            break;
                        default: throw "Неизвестное значение nested_base_stage [" + nested_base_stage + "]";
                            break;
                    }
                    break;
                default: throw "Неизвестный TransormType [" + transform.type + "]";
            }
            return result;
    }
}
function CreateTransformRoutineArray(cycle: ICycleNested): Array<NestedTransformRoutine> {
    let result: Array<NestedTransformRoutine> = [];
    while (cycle) {
        result.push(CreateNestedTransformRoutine(cycle.transform, cycle.base_stage));
        cycle = cycle.nested;
    }
    return result;
}