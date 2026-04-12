import { Type } from "@angular/core";
import { CollectionCrudRepository, FirestoreIdBase, Firestorm, IFirestormModel, IQueryBuildBlock, PathLike, Query, RepositoryInstantiator } from "@jiway/firestorm-core";


interface Markings {
    
    startId: string
    
    endId: string
    
    startIndex: number
    
    rangeSize: number

}

interface Context {
    
}


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

    async pick(): Promise<T_model | null>;
    /**
     * @param randomIndex 
     * @returns 
     * @deprecated It's only available for testing purposes.
     */
    async pick(randomIndex: number): Promise<T_model | null>;
    async pick(randomIndex?: number): Promise<T_model | null> {


        // Init
        const base = new FirestoreIdBase()
        const baseAscendingQuery    = new Query().orderBy("__name__", "ascending")
        const singAscQuery          = new Query().orderBy("__name__", "ascending").limit(1, "start")
        // const singleDescQuery       = new Query().orderBy("__name__", "ascending").limit(1, "end")

        const {amount: total} = await this.aggregateAsync({ amount: { verb: 'count' }}, baseAscendingQuery )

        if (randomIndex === undefined)
            randomIndex = Math.floor(Math.random() * total)


        const idFromSingleQuery = async (query: IQueryBuildBlock) => (await this.queryAsync(query))[0].id

        const startId = await idFromSingleQuery(singAscQuery)
        const endId = "".padEnd(startId.length, base.valueToChar(base.radix - 1))

        // const endId =   await idFromSingleQuery(singleDescQuery)
        
        // randomIndex: rankingOfTheElementToFetch,
        // fullRangeSize: total,
        const markings: Markings = {
            startId: startId,
            endId: endId,
            startIndex: 0,
            rangeSize: total
        }

        console.log("Aim:", randomIndex, startId, endId, total)
        console.log({...markings})
        // Dichotomy

        let dichotomyDepthRemaining = 20

        while (markings.rangeSize > 1 && dichotomyDepthRemaining > 0 ) {

            dichotomyDepthRemaining--

            // Pivot
            const pivotId = base.lerp(markings.startId, markings.endId, 1, 2)

            // Count from start to pivot
            const {startToPivotAmount} = await this.aggregateAsync(
                { startToPivotAmount: { verb: 'count' }},
                new Query().orderBy("__name__", "ascending").startAt(markings.startId).endAt(pivotId)
            )

            // Update the markings
            if (markings.startIndex == randomIndex) {
                console.log("Found!")
            }

            let lowIndex = markings.startIndex
            let medianIndex = markings.startIndex + startToPivotAmount
            let endIndex = markings.startIndex + markings.rangeSize - startToPivotAmount
            
            // In the lower part
            if (lowIndex <= randomIndex && randomIndex <= medianIndex) {

                markings.endId = pivotId
                markings.rangeSize = startToPivotAmount

            } else if (medianIndex < randomIndex && randomIndex < endIndex) {

                markings.startId = pivotId
                markings.startIndex += startToPivotAmount
                markings.rangeSize = endIndex - medianIndex

            } else {

                console.warn("Not supposed to happen", pivotId, startToPivotAmount)
            }

            markings.rangeSize = startToPivotAmount
            
            console.log({...markings})

        }

        const lastQueryResult = await this.queryAsync(
            new Query()
                .orderBy("__name__", "ascending")
                .startAt(markings.startId)
                .limit(markings.rangeSize || 1)
        )
        const res = lastQueryResult[randomIndex - markings.startIndex]
        
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