import { AggregateField, AggregateSpec, average, count, sum } from "firebase/firestore"

/**
 * Possible aggregation verbs.
 * - count: Counts all the documents matching the query
 * - sum: gets the sum of all the values in the field
 * - average: averages the value in the field
 */
export type AggregationVerb = 'count' | 'sum' | 'average'

/**
 * Definition for an aggregation query field
 */
export type ExplicitAggregationField = 
  {
    /** The action to perform on the field */
    verb: 'count'
  } 
  |
  {
    /** Field to compute the verb across the queried documents */
    field: string,
    /** The action to perform on the field */
    verb: 'sum'
  } 
  |
  {
    /** Field to compute the verb across the queried documents */
    field: string,
    /** The action to perform on the field */
    verb: 'average'
  }

/**
 * Definition for an aggreagation query
 */
export type ExplicitAggregationQuery = Record<string, ExplicitAggregationField>

/**
 * Type for the result of an aggregation query
 */
export type AggregationResult<Source> = Record<keyof Source, number>

function explicitAggregationFieldToAggregateField(eaf: ExplicitAggregationField): AggregateField<number> {
  switch (eaf.verb) {
    case 'count':   return count();
    case 'sum':     return sum(eaf.field)
    case 'average': return average(eaf.field)
  }
}

/**
 * Converts a firestorm aggregation query to a firestore aggregate spec
 * @param explicitAggregationQuery The aggreagation query to convert
 * @returns The quivalent aggregate spec
 */
export function aggregationQueryToAggregateSpec(explicitAggregationQuery: ExplicitAggregationQuery): AggregateSpec {
  const aggSpec: Record<string, AggregateField<number>> = {}
  for (const key in explicitAggregationQuery) {
    aggSpec[key] = explicitAggregationFieldToAggregateField(explicitAggregationQuery[key])
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
