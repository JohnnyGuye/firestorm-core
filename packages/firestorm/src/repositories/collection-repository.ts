import { IFirestormModel, Path, PathLike, RelationshipLocation, Type } from "../core";
import { Repository } from "./repository";
import { RepositoryInstantiator } from "./common";
import type { Firestorm } from "../firestorm";
import { Query, aggregationQueryToAggregateSpec, AggregationResult, ExplicitAggregationQuery, IQueryBuildBlock } from "../query";
import { getAggregateFromServer } from "firebase/firestore";

/**
 * Base repository for a collection
 * @template T_model Model of the collection
 */
export class CollectionRepository<T_model extends IFirestormModel> extends Repository<T_model> {

    /**
     * Creates a new {@link CollectionRepository} on a model
     * @param type Type on which the repository operates
     * @param firestorm The instance of firestORM this repository connects to
     * @param path The optional path to the collection of the document. If not provided, it default to root.
     */
    constructor(
        firestorm: Firestorm, 
        type: Type<T_model>, 
        path?: PathLike
        ) {

        super(firestorm, type, path)

    }

    /**
     * Runs an aggregation query on the collection.
     * 
     * @param aggQuery The aggregations to perform
     * @param query A narrowing query to aggregate only on a portion of the collection.
     * @returns The aggregation result
     */
    async aggregateAsync<A_Query extends ExplicitAggregationQuery>(
        aggQuery: A_Query, 
        query?: Query | IQueryBuildBlock
        ): Promise<AggregationResult<A_Query>> {


        const agg = aggregationQueryToAggregateSpec(aggQuery)
        const snapshot = await getAggregateFromServer(
            query ? this.toFirestoreQuery(query) : this.collectionRef,
            agg
        )

        return snapshot.data() as AggregationResult<A_Query>
    }

    /** @inheritdoc */
    protected override resolveRelationshipLocation(location: RelationshipLocation): Path {
        return Path.merge(this.collectionPath, location)
    }

}

/**
 * Gets the generator function for a {@link CollectionCrudRepository} of model {@link T}
 * @template T The model of the documents.
 * @returns A function that generated a single document repository on the document provided.
 */
export function createCollectionRepositoryInstantiator<T extends IFirestormModel>(): RepositoryInstantiator<CollectionRepository<T>, T> {
    return (
        firestorm: Firestorm,
        type: Type<T>, 
        path?: PathLike
    ) => {
        return new CollectionRepository(firestorm, type, path)
    }
}