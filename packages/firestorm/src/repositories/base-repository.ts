import { collection, doc, DocumentReference, DocumentSnapshot, Firestore, runTransaction, Transaction, TransactionOptions } from "firebase/firestore"

import { Type, buildPath } from "../core/helpers"
import { IFirestormModel, resolveId } from "../core/firestorm-model"
import { FIRESTORM_METADATA_STORAGE } from "../metadata-storage"
import { MissingIdentifierError } from "../errors"

import { ParentCollection } from "./parent-collection"
import { IParentCollectionOptions } from "./parent-collection-options.interface"
import { FirestoreDocument } from "../core/firestore-document"
import { TransactionFnc } from "../core/transaction"



/**
 * A repository is a typed access to a specific collection
 */
export class BaseRepository<T extends IFirestormModel> {
        
    private _type: Type<T>
    protected readonly firestore: Firestore
    private parents?: ParentCollection<IFirestormModel>[] = []
    
    /**
     * Creates a new repository on a model
     * @param type Type on which the repository operates
     * @param firestore The instance of firestore this repository connects to
     * @param parents The optional parent collections for repositories of subcollections
     */
    constructor(
        type: Type<T>,
        firestore: Firestore,
        parents?: IParentCollectionOptions<IFirestormModel>[]
        ) {
        
        this._type = type
        this.firestore = firestore
        if (parents) {
            this.parents = parents.map(ParentCollection.createFromOptions)
        }
    }

    /**
     * Gets the type this repository work on
     */
    public get type() {
        return this._type
    }

    /**
     * Gets the name of the type.
     * 
     * @deprecated Don't rely on its result to do stuff, the name will get mangled after compilation.
     */
    protected get typeName() {
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
    protected get typeMetadata() {
        return this.storage.getMetadatas<T>(this._type)
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
            for (const p of this.parents) {
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

    /**
     * Gets a reference to the document corresponding to this id.
     * 
     * @param id Id for which you want a document ref
     * @returns A document ref corresponding to the model
     */
    protected getDocumentRef(id: string): DocumentReference;
    /**
     * Gets a reference to the document corresponding to this model.
     * 
     * If the model doesn't have any id, it will give you a reference to a new document, generate an id and assign it to the model
     * 
     * @param model Model for which you want a document ref
     * @returns A document ref corresponding to the model
     */
    protected getDocumentRef(model: IFirestormModel): DocumentReference;
    /**
     * Gets a reference to the document corresponding to this model.
     * 
     * @param modelOrId Id or model for which you want a document ref
     * @returns A document ref corresponding to the model
     */
    protected getDocumentRef(modelOrId: IFirestormModel | string): DocumentReference;
    protected getDocumentRef(modelOrId: IFirestormModel | string): DocumentReference {
        let id = resolveId(modelOrId)
        if (id) {
            return doc(this.firestore, this.collectionPath, id)
        }

        const documentRef = doc(collection(this.firestore, this.collectionPath))
        
        if (typeof modelOrId === 'object') {
            modelOrId.id = id = documentRef.id
        }

        return documentRef
    }

    /**
     * Gets a collection reference to the collection of this repository
     * @returns Collection ref to this repository
     */
    protected get collectionRef() {
        return collection(this.firestore, this.collectionPath)
    }

    /**
     * Gets a document reference for each of the models provided.
     * 
     * @see getDocumentRef For the rules on each individual model/documentRef
     * 
     * @param ids Ids for which you want document refs
     * @returns A document ref for each of the models provided in the same order
     */
    protected getDocumentRefs(ids: string[]): DocumentReference[];
    /**
     * Gets a document reference for each of the models provided.
     * 
     * @see getDocumentRef For the rules on each individual model/documentRef
     * 
     * @param models Models for which you want document refs
     * @returns A document ref for each of the models provided in the same order
     */
    protected getDocumentRefs(models: IFirestormModel[]): DocumentReference[];
    /**
     * Gets a document reference for each of the models provided.
     * 
     * @param modelsOrIds Ids or models for which you want document refs
     * @returns A document ref for each of the models provided in the same order
     */
    protected getDocumentRefs(modelsOrIds: (IFirestormModel | string)[]): DocumentReference[];
    protected getDocumentRefs(modelsOrIds: (IFirestormModel | string)[]): DocumentReference[] {
        return modelsOrIds.map(mOrId => this.getDocumentRef(mOrId))
    }

    /**
     * Runs a tansaction on the transaction function provided
     * @param transactionFnc Operations to do durring the transaction
     * @param options Transaction options
     */
    protected async runTransactionAsync(transactionFnc: TransactionFnc, options?: TransactionOptions) {
        await runTransaction(
            this.firestore, 
            transactionFnc,
            options
        )
    }

    /**
     * Builds the path to a document
     * @param modelOrId Model or id for which you want the Firestore's DB path
     * @returns 
     */
    public pathToDocument(modelOrId: IFirestormModel | string): string {
        const id = resolveId(modelOrId)
        if (!id) throw new MissingIdentifierError()

        return buildPath(this.collectionPath, id)
    }

    /**
     * Converts a snapshot to a model
     * @param documentSnapshot Document snapshot in firestore
     * @returns 
     */
    protected firestoreDocumentSnapshotToClass(
        documentSnapshot: DocumentSnapshot
        ): T {
        
        const retrievedId: string = documentSnapshot.id
        const data = documentSnapshot.data()
        
        if (!data) {
            throw Error(`There is no data in the snapshot of ${retrievedId} in collection ${this.collectionPath}`)
        }

        const klass = this.documentToModel(data)
        if (!klass) {
            throw Error(`Failed to convert the document of id '${retrievedId}' in collection ${this.collectionPath}`)
        }

        klass.id = retrievedId

        return klass
    }

    /**
     * Converts a document to a model (if the id is not in the document, it is lost in the process)
     * @param document Document to convert
     * @returns The converted model
     */
    public documentToModel(document: FirestoreDocument): T {
        return this.typeMetadata.convertDocumentToModel(document)
    }

    /**
     * Converts multiple documents to their corresponding model
     * @param documents Documents to convert
     * @returns The converted models
     */
    public documentsToModels(documents: FirestoreDocument[]): T[] {
        return documents.map(d => this.documentToModel(d))
    }

    /**
     * Converts a partial model to a document
     * @param model Model to convert
     * @returns The converted document
     */
    public modelToDocument(model: Partial<T>): FirestoreDocument {
        return this.typeMetadata.convertModelToDocument(model)
    }

    /**
     * Converts multiple models to their corresponding document
     * @param models Models to convert
     * @returns The converted documents
     */
    public modelsToDocuments(models: Partial<T>[]): FirestoreDocument[] {
        return models.map(m => this.modelToDocument(m))
    }
}