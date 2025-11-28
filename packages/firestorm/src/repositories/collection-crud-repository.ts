import { 
    Firestore, 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    updateDoc,
    deleteDoc, 
    QuerySnapshot, 
    DocumentReference, 
    DocumentSnapshot,
    writeBatch,
    getAggregateFromServer,
    SnapshotListenOptions
} from "firebase/firestore";
import { Type } from "../core/type";
import { aggregationQueryToAggregateSpec, AggregationResult, ExplicitAggregationQuery, IQueryBuildBlock, isQueryBuildBlock, Query } from "../query";
import { IFirestormModel, IMandatoryFirestormModel } from "../core/firestorm-model";
import { RelationshipIncludes, RepositoryInstantiator } from "./common";
import { CollectionObservable, DocumentObservable, createCollectionObservable, createDocumentObservable, createQueryObservable } from "../realtime-listener";
import { CollectionDocumentTuples, PathLike } from "../core";
import { includeResolver } from "./toolkit";
import { CollectionRepository } from "./collection-repository";

/**
 * Repository with a basic CRUD implementation.
 */
export class CollectionCrudRepository<T_model extends IFirestormModel> extends CollectionRepository<T_model> {

    /**
     * Creates a new {@link CollectionCrudRepository} on a model
     * @param type Type on which the repository operates
     * @param firestore The instance of firestore this repository connects to
     * @param path The optional parent collections for repositories of subcollections
     */
    constructor(
        type: Type<T_model>, 
        firestore: Firestore, 
        path?: PathLike
        ) {
        super(type, firestore, path)
    }
    
    //#region Basic CRUD

    /**
     * Creates a new item in the database.
     * 
     * Not providing an id in the item auto generates an id.
     * 
     * If an item with the same id is already present it will override it destructively 
     * (the entire document will be replaced in database)
     * 
     * @param model Model to create
     * @returns A promise that resolved when and on the item that has been created.
     */
    async createAsync(model: T_model): Promise<T_model> {
        
        const documentRef = this.getDocumentRef(model)
        const data = this.modelToDocument(model)

        await setDoc(documentRef, data)

        return model
    }

    /**
     * Creates a collection of items in the database.
     * The operation is batched, so either they are all created or none are created.
     * 
     * It behaves exactly like {@link createAsync} on a per model basis.
     * 
     * @param models Models to create
     * @returns A promise that resolves when the items have been created.
     */
    async createMultipleAsync(...models: T_model[]): Promise<T_model[]> {
        const batch = writeBatch(this.firestore)

        models
            .map((model) => {
                return { 
                    ref: this.getDocumentRef(model),
                    data: this.modelToDocument(model) 
                }
            })
            .forEach(({ ref, data}) => {
                batch.set(ref, data)
            })
        
        await batch.commit()
        
        return models
    }

    /**
     * Modifies an item in the database.
     * @param model Partial or full model to update. It must have an id.
     * @returns A promise resolved when the item has been updated.
     */
    async updateAsync(model: Partial<T_model> & IMandatoryFirestormModel) {

        const documentRef = this.getDocumentRef(model)
        const data = this.modelToDocument(model)

        await updateDoc(documentRef, data)

        return
    }

    /**
     * Tries to find an item by its id in the database
     * @param id Id of the item to find
     * @returns A promise containing either the item retrieved or null if not found
     */
    async getByIdAsync(id: string, includes?: RelationshipIncludes<T_model>): Promise<T_model | null> {

        const documentSnapshot: DocumentSnapshot = await getDoc(this.getDocumentRef(id))

        if (!documentSnapshot.exists()) return null
        
        const model = this.firestoreDocumentSnapshotToModel(documentSnapshot)
        
        if (!includes) return model

        await Promise.all(includeResolver(includes, model, this.typeMetadata, this))
        // for (let pmd of this.typeMetadata.relationshipMetadatas) {

        //     const pName = pmd.name
        //     const relationship = pmd.relationship

        //     if (!hasFieldOfType(model, pName, ToOneRelationship)) continue
        //     const relProp = model[pName]
        //     if (isToOneRelationshipMetadata(relationship) && relProp instanceof ToOneRelationship && relProp.id ) {
                
        //         const cdt = this.resolveRelationshipLocation(relationship.location)
        //         const crud = getCrudRepositoryGenerator()(this.firestore, relProp.type, cdt)
        //         const include = await crud.findByIdAsync(relProp.id)
        //         if (include) {
        //             relProp.setModel(include)
        //         }

        //     }
        // }
        return model
    }

    /**
     * Check if a document with this id already exists in the database
     * @see getByIdAsync It's doing findById under the hood so it's almost always preferable to use the other. It's just a convenience
     * @param id Id of the item to check the existency
     * @returns A promise returning true if an item with this id exists in the collection
     */
    async existsAsync(id: string): Promise<boolean> {
        return await this.getByIdAsync(id) != null
    }

    /**
     * Queries a collection of items
     * @param firestormQuery Query
     * @returns A promise on the items that are results of the query
     */
    async queryAsync(firestormQuery: Query | IQueryBuildBlock, includes?: RelationshipIncludes<T_model>): Promise<T_model[]>{

        const querySnapshot: QuerySnapshot = await getDocs(this.toFirestoreQuery(firestormQuery))
        if (querySnapshot.empty) return []

        const models = querySnapshot.docs.map(docSnapshot => {
            return this.firestoreDocumentSnapshotToModel(docSnapshot)
        })

        if (!includes) return models

        for (let model of models) {
            await Promise.all(includeResolver(includes, model, this.typeMetadata, this))
        }

        return models
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

    /**
     * Listens to the changes of the full collection.
     * @returns An observable on the changes of any document in the collection
     */
    listen(): CollectionObservable<T_model>;
    /**
     * Listens to the changes of a document
     * 
     * @param id Id of the document to listen to
     * @returns An observable on the document's changes
     */
    listen(id: string): DocumentObservable<T_model>;
    /**
     * Listens to the changes of a document
     * 
     * @param model Model with the id of the document to listen to
     * @returns An observable on the document's changes
     */
    listen(model: IFirestormModel): DocumentObservable<T_model>;
    /**
     * Listens to the changes of documents in a query
     * 
     * @param query Query on the documents
     * @returns An observable on the documents matched by the query changes
     */
    listen(query: Query | IQueryBuildBlock): CollectionObservable<T_model>;
    listen(modelOrQueryOrId?: Query | IQueryBuildBlock | IFirestormModel | string) {

        const options: SnapshotListenOptions = { includeMetadataChanges: false, source: 'default' }
        
        if (!modelOrQueryOrId) {
            return createCollectionObservable(this, this.collectionRef, options)
        }

        if (modelOrQueryOrId instanceof Query || isQueryBuildBlock(modelOrQueryOrId)) {
            return createQueryObservable(this, this.collectionRef, modelOrQueryOrId, options)
        }

        const ref = this.getDocumentRef(modelOrQueryOrId)
        return createDocumentObservable(this, ref, options)
    }

    /**
     * Gets a random item in the whole collection.
     * 
     * It relies on the presence of the field "id" in the document so it won't work if that is not the case.
     * 
     * It's also absolutely bonker if there are not enough documents in the collection as it relies on id of the documents being relatively evenly distributed.
     * 
     * @returns A random element of the collection or null if no elements.
     */
    async getRandomAsync(): Promise<T_model | null> {
        
        const documentRef = doc(collection(this.firestore, this.collectionPath))
        const baseId = documentRef.id

        let res = await this.queryAsync(
            new Query()
                .where("id", ">=", baseId)
                .orderBy("id", 'ascending')
                .limit(1)
            )

        if (res.length == 1) return res[0]

        res = await this.queryAsync(
            new Query()
                .where("id", "<", baseId)
                .orderBy("id", 'descending')
                .limit(1)
            )

        if (res.length == 1) return res[0]

        return null
    }

    /**
     * Gets all the items of a collection
     * @returns A promise containing all the items in the collection
     */
    async getAllAsync(includes?: RelationshipIncludes<T_model>): Promise<T_model[]> {

        const querySnapshot: QuerySnapshot = await getDocs(this.collectionRef)

        if (querySnapshot.empty) return []

        const models = querySnapshot.docs.map(docSnapshot => {
            return this.firestoreDocumentSnapshotToModel(docSnapshot)
        })

        
        if (!includes) return models

        for (let model of models) {
            await Promise.all(includeResolver(includes, model, this.typeMetadata, this))
        }

        return models

    }

    /**
     * Deletes a document in the database.
     * It doesn't delete its subcollection if any.
     * 
     * Trying to delete a document that doesn't exist will just silently fail
     * 
     * @param id Id of the document to delete
     * @returns A promise that returns when the document has been deleted
     */
    async deleteAsync(id: string): Promise<void>;
    /**
     * Deletes a document in the database.
     * It doesn't delete its subcollection if any.
     * 
     * Trying to delete a document that doesn't exist will just silently fail
     * 
     * This doesn't typecheck the model. It only types check that you provided an id
     * 
     * @param model Model of the document to delete.
     * @returns A promise that returns when the document has been deleted
     */
    async deleteAsync(model: IFirestormModel): Promise<void>;
    async deleteAsync(modelOrId: IFirestormModel | string): Promise<void> {

        const path = this.pathToDocument(modelOrId)
        const docRef: DocumentReference = doc(this.firestore, path)
        await deleteDoc(docRef)
        
    }

    /**
     * Deletes multiple documents
     * It doesn't delete its subcollection if any.
     * 
     * This operation is batched
     * 
     * Trying to delete a document that doesn't exist silently fails.
     * 
     * @param ids Ids of the document to delete
     */
    async deleteMultipleAsync(ids: string[]): Promise<void>;
    /**
     * Deletes multiple documents
     * It doesn't delete its subcollection if any.
     * 
     * This operation is batched
     * 
     * Trying to delete a document that doesn't exist silently fails.
     * 
     * This doesn't typecheck the model. It only checks that you provided an id
     * 
     * @param models Models with the id of the documents to delete 
     */
    async deleteMultipleAsync(models: IFirestormModel[]): Promise<void>
    async deleteMultipleAsync(modelOrIds: (string | IFirestormModel)[]): Promise<void> {

        const batch = writeBatch(this.firestore)

        this.getDocumentRefs(modelOrIds)
            .forEach(ref => batch.delete(ref))
        
        await batch.commit()

    }

    /**
     * Delete all the documents in a query.
     * 
     * This is operation is partially batched, it deletes all the documents present when starting the query 
     * but doesn't delete the documents created while the query is running.
     * 
     * ⚠️ It's meant to be used in backend. Avoid doing this in front-end clients.
     * 
     */
    async deleteAllAsync() {
        const modelsToDelete = await this.getAllAsync()
        this.deleteMultipleAsync(modelsToDelete)
    }

    //#endregion

}

/**
 * Gets the generator function for a {@link CollectionCrudRepository} of model {@link T_Model}
 * @template T_Model The model of the documents.
 * @returns A function that generated a single document repository on the document provided.
 */
export function createCollectionCrudRepositoryInstantiator<T_Model extends IFirestormModel>(): RepositoryInstantiator<CollectionCrudRepository<T_Model>, T_Model> {
    return (
        firestore: Firestore, 
        type: Type<T_Model>, 
        path?: PathLike
    ) => {
        return new CollectionCrudRepository(type, firestore, path)
    }
}