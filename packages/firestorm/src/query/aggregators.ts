import { AggregateField, AggregateSpec, average, count, sum } from "firebase/firestore"
import { IFirestormModel } from "../core/firestorm-model"

/**
 * Possible aggregation verbs.
 * - count: Counts all the documents matching the query
 * - sum: gets the sum of all the values in the field
 * - average: averages the value in the field
 */
export type AggregationVerb = 'count' | 'sum' | 'average'

export type ExplicitAggregationField = 
  {
    verb: 'count'
  } 
  |
  {
    field: string,
    verb: 'sum'
  } 
  |
  {
    field: string,
    verb: 'average'
  }

export type ExplicitAggregationQuery = Record<string, ExplicitAggregationField>

// export type ImplicitAggregationQuery<M> = Record<keyof M, AggregationVerb>

// export type AggregationQuery<M> = ImplicitAggregationQuery<M> | ExplicitAggregationQuery

export type AggregationResult<Source> = Record<keyof Source, number>

export function explicitAggregationFieldToAggregateField(eaf: ExplicitAggregationField): AggregateField<number> {
  switch (eaf.verb) {
    case 'count':   return count();
    case 'sum':     return sum(eaf.field)
    case 'average': return average(eaf.field)
  }
}
export function aggregationQueryToAggregateSpec(eaq: ExplicitAggregationQuery): AggregateSpec {
  const aggSpec: any = {}
  for (let key in eaq) {
    aggSpec[key] = explicitAggregationFieldToAggregateField(eaq[key])
  }
  return aggSpec
}
// export function isExplicit<M>(aggQuery: AggregationQuery<M>): aggQuery is ExplicitAggregationQuery {
//   return 'verb' in aggQuery
// }

        // const partialMapping = new Map<string, string>()

        // for (let key of Object.getOwnPropertyNames(aggQuery)) {
        //     const mappedTo = this.typeMetadata.isMappedTo(key)
        //     if (!mappedTo) {
        //         logWarn(`The property ${key} as no document correspondance`)
        //         continue
        //     }
        //     partialMapping.set(key, mappedTo)
        // }

        // const aggSpec = (() => {
        //     let as: Record<string, AggregateField<number>> = {}
        //     for (let [key, mapping] of partialMapping) {
        //         switch ((aggQuery as any)[key] as AggregationVerb) {
        //             case 'count':
        //                 as[key] = count()
        //                 break;
        //             case 'average':
        //                 as[key] = average(mapping)
        //                 break;
        //             case 'sum':
        //                 as[key] = sum(mapping)
        //                 break;
        //         }
        //     }
        //     return as
        // })()
