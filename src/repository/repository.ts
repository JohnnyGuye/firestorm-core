import { Type } from "../core/helpers";
import { IQueryBuildBlock, Query } from "../query";
import { collection, deleteDoc, doc, DocumentReference, DocumentSnapshot, Firestore, getDoc, getDocs, query, QuerySnapshot, setDoc, updateDoc, where } from "firebase/firestore";
import { MissingIdentifierError } from "../errors";
import { FIRESTORM_METADATA_STORAGE } from "../storage";
import { FirestormModel } from "../core/firestorm-model";

export interface IRepository {

}

function buildPath(...pathArray: string[]) {
    return pathArray.join("/")
}

// Technically I could infer the type from the instance T. There is probably a way aswell to not use the key though it may be complicated

/*
### Should be possible if T only has one matching subcollection matching this model

interface IParentCollectionSetOne<T extends FirestormModel> {
    instance: T
}

### Should be always possible

interface IParentCollectionSetTwo<T extends FirestormModel> {
    instance: T
    key: string
}

### Should also be viable you don't need an actual instance if you give the type, you just need the id

interface IParentCollectionSetThree<T extends FirestormModel> {
    type: Type<T>
    partialInstanceOrId: FirestormModel | string
    key: string
}
*/

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
    
    /**
     * Creates a new repository on a model
     * @param type Type on which the repository operates
     * @param firestore The instance of firestore this repository connects to
     * @param parents The optional parent collections for repositories of subcollections
     */
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

    /**
     * The storage of metadatas of this repository
     */
    protected get storage() {
        return FIRESTORM_METADATA_STORAGE
    }

    /**
     * The metadatas corresponding to the type of this repository
     */
    public get typeMetadata() {
        return this.storage.getMetadatas(this._type)
    }

    /**
     * Whether or not this repository is a subcollection or not
     */
    public get hasParents() {
        return this.parents && this.parents.length > 1
    }

    /**
     * Gets the path to the collection of this repository
     */
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
     * @returns A promise that resolved when the item has been created.
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
     * 
     * If the id is not provided or the document doesn't exist, it will fail.
     * 
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

        let path = buildPath(this.collectionPath, id)

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

    private firestoreDocumentToClass(document: any): T | null {
        return this.typeMetadata.convertDocumentToModel(document)
    }

    private classToFirestoreDocument(object: Partial<T>): any {
        return this.typeMetadata.convertModelToDocument(object)
    }
}