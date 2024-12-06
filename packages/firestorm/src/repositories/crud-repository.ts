import { 
    Firestore, 
    collection, 
    doc, 
    getDoc, 
    getDocs, 
    setDoc, 
    updateDoc,
    deleteDoc, 
    query, 
    QuerySnapshot, 
    DocumentReference, 
    DocumentSnapshot,
    writeBatch
} from "firebase/firestore";
import { Type } from "../core/helpers";
import { IQueryBuildBlock, Query } from "../query";
import { IFirestormModel, IMandatoryFirestormModel } from "../core/firestorm-model";
import { BaseRepository } from "./base-repository";
import { IParentCollectionOptions } from "./parent-collection-options.interface";
import { RepositoryGeneratorFunction } from "./repository-creation-function";

/**
 * Repository with a basic CRUD implementation.
 */
export class CrudRepository<T extends IFirestormModel> extends BaseRepository<T> {

    constructor(
        type: Type<T>, 
        firestore: Firestore, 
        parents?: IParentCollectionOptions<IFirestormModel>[]
        ) {
        super(type, firestore, parents)
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
     * @param model 
     * @returns A promise that resolved when and on the item that has been created.
     */
    async createAsync(model: T): Promise<T> {
        
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
     * @param models 
     * @returns A promise that resolves when the items have been created.
     */
    async createMultipleAsync(...models: T[]): Promise<T[]> {
        const batch = writeBatch(this.firestore)

        models
            .map((model) => {
                return { 
                    model: model,
                    ref: this.getDocumentRef(model),
                    data: this.modelToDocument(model) 
                }
            })
            .forEach(({ model, ref, data}) => {
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
    async updateAsync(model: Partial<T> & IMandatoryFirestormModel) {

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
    async findByIdAsync(id: string): Promise<T | null> {

        const documentSnapshot: DocumentSnapshot = await getDoc(this.getDocumentRef(id))

        if (!documentSnapshot.exists()) return null
        
        return this.firestoreDocumentSnapshotToClass(documentSnapshot)
    }

    /**
     * Check if a document with this id already exists in the database
     * @see findByIdAsync It's doing findById under the hood so it's almost always preferable to use the other. It's just a convenience
     * @param id Id of the item to check the existency
     * @returns A promise returning true if an item with this id exists in the collection
     */
    async existsAsync(id: string): Promise<boolean> {
        return await this.findByIdAsync(id) != null
    }

    /**
     * Queries a collection of items
     * @param firestoryQuery Query
     * @returns A promise on the items that are results of the query
     */
    async queryAsync(firestoryQuery: Query | IQueryBuildBlock): Promise<T[]>{

        const col = collection(this.firestore, this.collectionPath)

        const q = query(col, ...firestoryQuery.toConstraints())
        const querySnapshot: QuerySnapshot = await getDocs(q)
        if (querySnapshot.empty) return []

        return querySnapshot.docs.map(docSnapshot => {
            return this.firestoreDocumentSnapshotToClass(docSnapshot)
        })
    }

    /**
     * Gets a random item in the whole collection.
     * 
     * It relies on the presence of the field "id" in the document so it won't work if that is not the case.
     * 
     * @returns A random element of the collection or null if no elements.
     */
    async getRandomAsync(): Promise<T | null> {
        
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
    async findAllAsync(): Promise<T[]> {

        const querySnapshot: QuerySnapshot = await getDocs(this.collectionRef)

        if (querySnapshot.empty) return []

        return querySnapshot.docs.map(docSnapshot => {
            return this.firestoreDocumentSnapshotToClass(docSnapshot)
        })

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
     * This doesn't typecheck the model. It only types check that you provided an id
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
        const modelsToDelete = await this.findAllAsync()
        this.deleteMultipleAsync(modelsToDelete)
    }

    //#endregion

}

/**
 * Gets the generator function for a {@link CrudRepository} of model {@link T}
 * @template T The model of the documents.
 * @returns A function that generated a single document repository on the document provided.
 */
export function getCrudRepositoryGenerator<T extends IFirestormModel>(): RepositoryGeneratorFunction<CrudRepository<T>, T> {
    return (
        firestore: Firestore, 
        type: Type<T>, 
        parentCollections?: IParentCollectionOptions[]
    ) => {
        return new CrudRepository(type, firestore, parentCollections)
    }
}




