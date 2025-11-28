import { Firestore } from "firebase/firestore";
import { IFirestormModel, PathLike, Type } from "../core";
import { Repository } from "./repository";
import { RepositoryInstantiator } from "./common";

export class CollectionRepository<T_model extends IFirestormModel> extends Repository<T_model> {

    /**
     * Creates a new {@link CollectionRepository} on a model
     * @param type Type on which the repository operates
     * @param firestore The instance of firestore this repository connects to
     * @param parents The optional parent collections for repositories of subcollections
     */
    constructor(
        type: Type<T_model>, 
        firestore: Firestore, 
        path?: PathLike
        ) {

        super(type, firestore, path)

    }
        
    // //#region Smthg

    // /**
    //  * Gets the basic CRUD repository for a model
    //  * @template T_linked_model Type of the model
    //  * @param type Type of the model
    //  * @param location 
    //  * @returns 
    //  */
    // public getCrudRepository<T_linked_model extends IFirestormModel>(
    //     type: Type<T_linked_model>, 
    //     location: RelationshipLocation
    //     ): CrudRepository<T_linked_model> {
    //     return this.getRepositoryFromFunction(
    //         getCrudRepositoryGenerator(), 
    //         type, 
    //         location
    //     )
    // }

    // //#endregion

}

/**
 * Gets the generator function for a {@link CollectionCrudRepository} of model {@link T}
 * @template T The model of the documents.
 * @returns A function that generated a single document repository on the document provided.
 */
export function createCollectionRepositoryInstantiator<T extends IFirestormModel>(): RepositoryInstantiator<CollectionRepository<T>, T> {
    return (
        firestore: Firestore, 
        type: Type<T>, 
        path?: PathLike
    ) => {
        return new CollectionRepository(type, firestore, path)
    }
}