import { Type } from "@angular/core";
import { collection, deleteDoc, doc, DocumentReference, DocumentSnapshot, Firestore, getDoc, getDocs, query, QuerySnapshot, setDoc, where } from "firebase/firestore";
import { MissingIdentifierError } from "../errors";
import { FIRESTORM_METADATA_STORAGE } from "../storage";
import { FirestormModel } from "./firestorm-model";
import { Query } from "./query";
import { IQueryBuildBlock } from "./query-builder";

export interface IRepository {

}

function buildPath(...pathArray: string[]) {
    return pathArray.join("/")
}

export interface IParentCollection<T extends FirestormModel> {
    
    type: Type<T>
    instance: T
    key: string
    
}

class ParentCollection<T extends FirestormModel> 
    implements IParentCollection<T> {

    readonly type: Type<T>
    readonly instance: T
    readonly key: string
    
    constructor(type: Type<T>, parent: T, key: string) {
        this.type = type
        this.instance = parent
        this.key = key
    }

    protected get storage() {
        return FIRESTORM_METADATA_STORAGE
    }

    public get typeMetadata() {
        return this.storage.getMetadatas(this.type)
    }

    public get collection() {
        return this.typeMetadata.collection
    }

    public get id() {
        return this.instance.id
    }
}

/**
 * A repository is a typed access to a specific collection
 */
export class Repository<T extends FirestormModel> {
    
    private _type: Type<T>
    protected readonly firestore: Firestore
    private parents?: ParentCollection<any>[] = []
    
    constructor(
        type: Type<T>,
        firestore: Firestore,
        parents?: IParentCollection<any>[]
        ) {
        
        this._type = type
        this.firestore = firestore
        if (parents) {
            this.parents = parents.map(
                value => new ParentCollection(value.type, value.instance, value.key)
            )
        }
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

    public get hasParents() {
        return this.parents && this.parents.length > 1
    }

    public get collectionPath() {
        const col = this.typeMetadata.collection
        if (!col) throw new Error("No collection provided")

        const pathBlocks: string[] = []
        if (this.parents) {
            for (let p of this.parents) {
                const c = p.collection
                const id = p.id

                if (!c) throw new Error("No collection provided for this parent")
                if (!id) throw new Error("No id for this element")

                pathBlocks.push(c)
                pathBlocks.push(id)
            }
        }
        pathBlocks.push(col)
        return buildPath(...pathBlocks)
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

    async query(firestoryQuery: Query | IQueryBuildBlock): Promise<T[]>{
        const path = buildPath(this.collectionPath)
        const col = collection(this.firestore, path)

        const q = query(col, ...firestoryQuery.toConstraints())
        const querySnapshot: QuerySnapshot = await getDocs(q)
        if (querySnapshot.empty) return []

        return querySnapshot.docs.map(docSnapshot => {
            return this.firestoreDocumentSnapshotToClass(docSnapshot)
        })
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