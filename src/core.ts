import {
    IRoot, ICycle, IWorkoutTemplate, IDictionary,
    CycleKinds, KindRelativities, IWorkoutContent,
    IStageSizeTransform, IBaseTransform
} from "./root";

export type StageSizeTransform = (index: number, weight: number) => number;
export type BaseTransform = (weight: number) => number;

export interface IComputeData {
    date_begin?: Date;
    cycle_id: string;
    workout_id: string;
    exe_weights: IDictionary<number>;
}
class ComputeData {
    date_begin: Date = TrimDate(new Date());
    cycle: ICycle;
    workout: IWorkoutTemplate;
    exe_weights: IDictionary<number>;
    constructor(config: IRoot, source: IComputeData) {
        this.cycle = config.cycles[source.cycle_id];
        if (!this.cycle) throw "Недопустимый cycle_id [" + source.cycle_id + "]";
        this.workout = config.workout_templates[source.workout_id];
        if (!this.workout) throw "Недопустимый workout_id [" + source.workout_id + "]";
        this.exe_weights = source.exe_weights;
        if (source.date_begin) this.date_begin = TrimDate(source.date_begin);
    }
}
export function Compute(config: IRoot, source: IComputeData): any {
    let result: Array<IWorkoutExeWeights> = [];
    let data: ComputeData = new ComputeData(config, source);
    let days_offset: number = 0;
    let transform: Array<StageSizeTransform> = CreateTransformArray(data.cycle);
    for (let i = 0; i < data.cycle.length_steps; i++) {
        for (let wk_name in data.workout.workouts) {
            let wk_content: IWorkoutContent = data.workout.workouts[wk_name];
            if (wk_content.offset > data.workout.length_days)
                throw "Смещение тренировки больше размера шага цикла";
            let wk_result: IWorkoutExeWeights = {
                date: IncDays(data.date_begin, days_offset + wk_content.offset),
                workout_name: wk_name,
                data: {}
            };
            for (let w_exe_name in wk_content.exercise_cycles) {
                if (!data.exe_weights[w_exe_name])
                    throw "Нет данных о весе по упражнению '" + w_exe_name + "'";
                if (wk_content.exercise_cycles[w_exe_name] >= transform.length)
                    throw "В тренировке '" + wk_name + "' упражнение '" +
                    w_exe_name + "' содержит несуществующий индекс вложенности цикла [" +
                    wk_result.data[w_exe_name] + "]";
                wk_result.data[w_exe_name] =
                    transform[wk_content.exercise_cycles[w_exe_name]](i - data.cycle.base_step,
                        data.exe_weights[w_exe_name]);
            }
            result.push(wk_result);
            days_offset = days_offset + data.workout.length_days;
        }
    }

    console.log("yes!");
    return result;
}

function CreateStageSizeTransform(input: IStageSizeTransform) {
    let result: StageSizeTransform;
    switch (input.kind) {
        case CycleKinds.linear:
            switch (input.relativity) {
                case KindRelativities.absolute:
                    result = (index, weight) => weight + index * input.parameter;
                    break;
                case KindRelativities.procent:
                    result = (index, weight) =>
                        weight + index * weight * input.parameter / 100;
                    break;
                default: throw "Неизвестный тип relativity'" + input.relativity + "'";
            }
            break;
        default: throw "Неизвестный тип kind '" + input.kind + "'";
    }
    return result;
}


function CreateBaseTransform(input: IBaseTransform): BaseTransform {
    let result: BaseTransform;
    switch (input.relativity) {
        case KindRelativities.absolute:
            result = weight => weight + input.parameter;
            break;
        case KindRelativities.procent:
            result = weight => weight * input.parameter / 100
            break;
        default: throw "Неизвестное значение relativity '" + input.relativity + "'";
    }
    return result;
}

function TrimDate(date: Date): Date {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
function IncDays(date: Date, days: number): Date {
    let result: Date = new Date(date.valueOf());
    result.setDate(result.getDate() + days);
    return result;
}

function CreateTransformArray(cycle: ICycle): Array<StageSizeTransform> {
    let result: Array<StageSizeTransform> = [];
    while (cycle) {
        let w_stage_size_transform: StageSizeTransform =
            cycle.stage_size_transform ?
                CreateStageSizeTransform(cycle.stage_size_transform) :
                (index, weight) => weight;
        let w_base_transform: BaseTransform = cycle.base_transform ?
            CreateBaseTransform(cycle.base_transform) :
            weight => weight;
        result.push((index, weight) =>
            w_stage_size_transform(index, w_base_transform(weight)));
        cycle = cycle.nested;
    }
    return result;
}

export interface IWorkoutExeWeights {
    date: Date;
    workout_name: string;
    data: IDictionary<number>;
}