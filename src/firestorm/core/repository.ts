import { Type } from "@angular/core";
import { collection, deleteDoc, doc, DocumentReference, DocumentSnapshot, Firestore, getDoc, getDocs, query, QuerySnapshot, setDoc } from "firebase/firestore";
import { MissingIdentifierError } from "../errors";
import { FIRESTORM_METADATA_STORAGE } from "../storage";
import { FirestormModel } from "./firestorm-model";

export interface IRepository {

}

function buildPath(...pathArray: string[]) {
    return pathArray.join("/")
}

export interface IParentCollection<T extends FirestormModel> {

    parent: T
    key: string
    
}

/**
 * A repository is a typed access to a specific collection
 */
export class Repository<T extends FirestormModel> {
    
    private _type: Type<T>
    protected readonly firestore: Firestore
    
    constructor(
        type: Type<T>,
        firestore: Firestore
        ) {
        
        this._type = type
        this.firestore = firestore
    }

    /**
     * Gets the type this repository work on
     */
    public get type() {
        return this._type
    }

    /**
     * Gets the name of the type
     */
    public get typeName() {
        return this.type.name
    }

    protected get storage() {
        return FIRESTORM_METADATA_STORAGE
    }

    public get typeMetadata() {
        return this.storage.getMetadatas(this._type)
    }

    public get collectionPath() {
        return "cities"
    }

    //#region Basic CRUD

    /**
     * Tries to find an item by its id in the database
     * @param id Id of the item to find
     * @returns 
     */
    async findById(id: string): Promise<T | null> {

        let path = buildPath(this.collectionPath, id)

        const docRef: DocumentReference = doc(this.firestore, path)
        const documentSnapshot: DocumentSnapshot = await getDoc(docRef)

        if (!documentSnapshot.exists()) return null
        
        // const retrievedId: string = documentSnapshot.id
        // const data = documentSnapshot.data

        // const klass = this.firestoreDocumentToClass(data)
        // if (!klass) {
        //     console.error("Failed to convert the document to a typed object:", id, data)
        //     return null
        // }

        // klass.id = id

        return this.firestoreDocumentSnapshotToClass(documentSnapshot)
    }

    /**
     * Creates a new item in the database.
     * 
     * Not providing an id in the item auto generates an id.
     * 
     * If an item with the same id is already present it will override it destructively 
     * (the entire document will be replaced in database)
     * 
     * @param model 
     * @returns 
     */
    async create(model: T): Promise<void> {
        
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

        return
    }

    /**
     * Modifies an item in the database.
     * If the id is not provided, it will create a new object.
     * @param model Partial or full model to update. 
     * @returns 
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

        await setDoc(documentRef, data)

        return
    }

    /**
     * Gets all the items of a collection
     * @returns A promise containing all the items in the collection
     */
    async findAll(): Promise<T[]> {

        let path = buildPath(this.collectionPath)

        const querySnapshot: QuerySnapshot = await getDocs(collection(this.firestore, path))

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
     */
    async delete(model: FirestormModel): Promise<void>;
    async delete(modelOrId: FirestormModel | string): Promise<void> {

        const id: string | null | undefined = (typeof modelOrId !== "string" ? modelOrId.id : modelOrId)
        
        if (!id) throw new MissingIdentifierError()

        const path = buildPath(this.collectionPath, id)
        const docRef: DocumentReference = doc(this.firestore, path)
        await deleteDoc(docRef)
        
    }

    //#endregion

    private firestoreDocumentSnapshotToClass(
        documentSnapshot: DocumentSnapshot
        ): T {
        
        const retrievedId: string = documentSnapshot.id
        const data = documentSnapshot.data()

        const klass = this.firestoreDocumentToClass(data)
        if (!klass) {
            console.error("Failed to convert the document to a typed object:", retrievedId, data)
            throw Error(`Failed to convert the document of id '${retrievedId}' in colleciton ${this.collectionPath}`)
        }

        klass.id = retrievedId

        return klass
    }

    public firestoreDocumentToClass(document: any): T | null {
        return this.typeMetadata.convertDocumentToModel(document)
    }

    private classToFirestoreDocument(object: Partial<T>): any {
        return this.typeMetadata.convertModelToDocument(object)
    }
}