import { Type } from "../core/helpers";
import { IQueryBuildBlock, Query } from "../query";
import { collection, deleteDoc, doc, DocumentReference, DocumentSnapshot, Firestore, getDoc, getDocs, query, QuerySnapshot, setDoc, updateDoc, where } from "firebase/firestore";
import { FirestormModel } from "../core/firestorm-model";
import { BaseRepository } from "./base-repository";
import { IParentCollection } from "./parent-collection.interface";

export interface IRepository {

}


export class CrudRepository<T extends FirestormModel> extends BaseRepository<T> {

    constructor(type: Type<T>, firestore: Firestore, parents?: IParentCollection<any>[]) {
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
    async create(model: T): Promise<T> {
        
        let id = model.id
        let documentRef: DocumentReference
        if (!id) {
            documentRef = doc(collection(this.firestore, this.collectionPath))
            model.id = id = documentRef.id
        } else {
            documentRef = doc(this.firestore, this.collectionPath, id)
        }
        
        const data = this.classToFirestoreDocument(model)

        await setDoc(documentRef, data)

        return model
    }

    /**
     * Modifies an item in the database.
     * If the id is not provided, it will create a new object.
     * @param model Partial or full model to update. 
     * @returns A Promise that resolved when the item has been updated (or created)
     */
    async update(model: Partial<T>) {

        let id = model.id
        let documentRef: DocumentReference
        if (!id) {
            documentRef = doc(collection(this.firestore, this.collectionPath))
            model.id = id = documentRef.id
        } else {
            documentRef = doc(this.firestore, this.collectionPath, id)
        }

        const data = this.classToFirestoreDocument(model)

        await updateDoc(documentRef, data)

        return
    }

    /**
     * Tries to find an item by its id in the database
     * @param id Id of the item to find
     * @returns A promise containing either the item retrieved or null if not found
     */
    async findById(id: string): Promise<T | null> {

        let path = this.pathToDocument(id)

        const docRef: DocumentReference = doc(this.firestore, path)
        const documentSnapshot: DocumentSnapshot = await getDoc(docRef)

        if (!documentSnapshot.exists()) return null
        
        return this.firestoreDocumentSnapshotToClass(documentSnapshot)
    }

    /**
     * Check if a document with this id already exists in the database
     * @warning It's doing findById under the hood so it's almost always preferable to use the other. It's just a convenience
     * @param id Id of the item to check the existency
     * @returns A promise returning true if an item with this id exists in the collection
     */
    async exists(id: string): Promise<boolean> {
        return await this.findById(id) != null
    }

    /**
     * Queries a collection of items
     * @param firestoryQuery Query
     * @returns A promise on the items that are results of the query
     */
    async query(firestoryQuery: Query | IQueryBuildBlock): Promise<T[]>{

        const col = collection(this.firestore, this.collectionPath)

        const q = query(col, ...firestoryQuery.toConstraints())
        const querySnapshot: QuerySnapshot = await getDocs(q)
        if (querySnapshot.empty) return []

        return querySnapshot.docs.map(docSnapshot => {
            return this.firestoreDocumentSnapshotToClass(docSnapshot)
        })
    }

    /**
     * @warning Experimental
     * Gets a random item in the whole collection
     * @returns 
     */
    async getRandom(): Promise<T | null> {
        
        const documentRef = doc(collection(this.firestore, this.collectionPath))
        const baseId = documentRef.id
        let res = await this.query(new Query().where("id", ">=", baseId).orderBy("id", 'ascending').limit(1))
        if (res.length == 1) return res[0]

        res = await this.query(new Query().where("id", "<", baseId).orderBy("id", 'descending').limit(1))

        if (res.length == 1) return res[0]

        return null
    }

    /**
     * Gets all the items of a collection
     * @returns A promise containing all the items in the collection
     */
    async findAll(): Promise<T[]> {

        const querySnapshot: QuerySnapshot = await getDocs(collection(this.firestore, this.collectionPath))

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
    async delete(id: string): Promise<void>;
    /**
     * Deletes a document in the database.
     * It doesn't delete its subcollection if any.
     * 
     * Trying to delete a document that doesn't exist will just silently fail
     * 
     * @warning This doesn't typecheck the model. It only types check that you provided an id
     * @param model Model of the document to delete.
     * @returns A promise that returns when the document has been deleted
     */
    async delete(model: FirestormModel): Promise<void>;
    async delete(modelOrId: FirestormModel | string): Promise<void> {

        const path = this.pathToDocument(modelOrId)
        const docRef: DocumentReference = doc(this.firestore, path)
        await deleteDoc(docRef)
        
    }

    //#endregion

}





