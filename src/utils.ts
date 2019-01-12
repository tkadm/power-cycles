import { ICycleNested, ITransform, ITraining, ICycleMain } from "./root"

export function DateCopy(source: Date, offset_days: number): Date {
    let result: Date = new Date(source.valueOf());
    result.setDate(result.getDate() + offset_days);
    return result;
}

export function DateTrunc(source: Date): Date {
    return new Date(source.getFullYear(), source.getMonth(),
        source.getDate());
}

export function DaysBetween(earlier: Date, later: Date): number {
    return (later.valueOf() - earlier.valueOf()) / (24 * 60 * 60 * 1000);
}

export enum TransformType { linear = "linear" };
export enum TransformRelativity { absolute = "absolute", procent = "procent" };
export enum NestedCycleBaseStage { prev = "prev", next = "next" }
export interface IDictionary<Type> {
    [index: string]: Type;
}
export interface INumericDictionary<Type> {
    [index: number]: Type;
}
export type MainTransformRoutine = (index: number, base_weight: number) => number;
export type NestedTransformRoutine = (index: number, prev_weight: number, next_weight: number) => number;

export function CreateMainTransformRoutine(transform: ITransform): MainTransformRoutine {
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
                default: throw "Неизвестный relativity [" + transform.relativity + "]";
            }
            break;
        default: throw "Неизвестный TransormType [" + transform.type + "]";
    }
    return result;
}
export function CreateNestedTransformRoutine(transform: ITransform, nested_base_stage: NestedCycleBaseStage): NestedTransformRoutine {
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
                    }
                    break;
                default: throw "Неизвестный TransormType [" + transform.type + "]";
            }
        default: throw "Неизвестный тип type [" + transform.type + "]";
    }
    return result;
}
export function CreateTransformRoutineArray(cycle: ICycleNested): Array<NestedTransformRoutine> {
    let result: Array<NestedTransformRoutine> = [];
    while (cycle) {
        result.push(CreateNestedTransformRoutine(cycle.transform, cycle.base_stage));
        cycle = cycle.nested;
    }
    return result;
}
export namespace initialization {
    export function InitObject(source: any, destination: any, skip: Array<string>) {
        for (let prop of Object.keys(source).filter(item => skip.indexOf(item) === -1)) {
            let type: string = typeof destination[prop];
            if (type !== "undefined") {
                if (type === "object") {
                    InitObject(source[prop], destination[prop], skip);
                } else {
                    if (typeof source[prop] === type)
                        destination[prop] = source[prop];
                }
            }
        }
    }

    export function assign_missing_data(training: any, source: any): void {
        for (let prop of Object.keys(source)) {
            let type: string = typeof training[prop];
            if (type === "undefined") {
                training[prop] = source[prop];
            } else
                if (type === "object" && typeof source[prop] === "object") {
                    assign_missing_data(training[prop], source[prop]);
                } //else throw "Не совпадают типы свойства \"" + prop + "\"";
        }
    }
}