import { Type } from "@angular/core";
import { CollectionCrudRepository, CollectionRepository, FirestoreIdBase, Firestorm, IFirestormModel, IQueryBuildBlock, PathLike, Query, RepositoryInstantiator } from "@jiway/firestorm-core";

export class RandomRepository<T_model extends IFirestormModel> extends CollectionCrudRepository<T_model> {

    /**
     * Creates a new {@link RandomRepository} on a model
     * @param firestorm The instance of firestORM this repository connects to
     * @param type Type on which the repository operates
     * @param path The optional parent collections for repositories of subcollections
     */
    constructor(
        firestorm: Firestorm, 
        type: Type<T_model>, 
        path?: PathLike
        ) {
        super(firestorm, type, path)
    }

    async pick(): Promise<T_model | null> {


        // Init
        const baseAscendingQuery    = new Query().orderBy("__name__", "ascending")
        const singAscQuery          = new Query().orderBy("__name__", "ascending").limit(1, "start")
        const singleDescQuery       = new Query().orderBy("__name__", "ascending").limit(1, "end")

        const {amount: total} = await this.aggregateAsync({ amount: { verb: 'count' }}, baseAscendingQuery )

        const rankingOfTheElementToFetch = Math.floor(Math.random() * total)

        const idFromSingleQuery = async (query: IQueryBuildBlock) => (await this.queryAsync(query))[0].id

        const startId = await idFromSingleQuery(singAscQuery)
        const endId =   await idFromSingleQuery(singleDescQuery)

        const markings = {
            startId: startId,
            endId: endId,
            randomIndex: rankingOfTheElementToFetch,
            fullRangeSize: total,
            localStartId: startId,
            localEndId: endId,
            localStartIndex: 0,
            localRangeSize: total
        }

        const base = new FirestoreIdBase()

        // Dichotomy

        while (markings.localRangeSize > 1) {

            // Pivot
            const pivotId = base.lerp(markings.localStartId, markings.localEndId, 1, 2)

            // Count from start to pivot
            const {startToPivotAmount} = await this.aggregateAsync(
                { startToPivotAmount: { verb: 'count' }},
                baseAscendingQuery.startAt(markings.localStartId).endAt(markings.localEndId)
            )

            // Update the markings
            if (markings.localStartIndex + startToPivotAmount < markings.randomIndex) {
                markings.localEndId = pivotId
            } else {
                markings.localStartId = pivotId
                markings.localStartIndex += startToPivotAmount
            }

            markings.localRangeSize = startToPivotAmount
            

        }

        const lastQueryResult = await this.queryAsync(baseAscendingQuery.startAt(markings.localStartId).limit(markings.localRangeSize))
        const res = lastQueryResult[markings.randomIndex - markings.localStartIndex]
        
        return res
    }

}

/**
 * Gets the generator function for a {@link RandomRepository} of model {@link T_Model}
 * @template T_Model The model of the documents.
 * @returns A function that generated a single document repository on the document provided.
 */
export function createRandomRepositoryInstantiator<T_Model extends IFirestormModel>(): RepositoryInstantiator<RandomRepository<T_Model>, T_Model> {
    return (
        firestorm: Firestorm, 
        type: Type<T_Model>, 
        path?: PathLike
    ) => {
        return new RandomRepository(firestorm, type, path)
    }
}