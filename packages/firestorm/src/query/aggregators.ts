import { IFirestormModel } from "../core/firestorm-model"

export type AggregationVerbs = 'count' | 'sum' | 'average'
export type AggregationQuery<M extends Partial<IFirestormModel>> = Record<keyof M, AggregationVerbs>
export type AggregationResult<Source> = Record<keyof Source, number>