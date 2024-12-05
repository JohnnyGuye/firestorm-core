import { DocumentSnapshot, Firestore } from "firebase/firestore"

import { Type, buildPath } from "../core/helpers"
import { IFirestormModel, resolveId } from "../core/firestorm-model"
import { FIRESTORM_METADATA_STORAGE } from "../metadata-storage"
import { MissingIdentifierError } from "../errors"

import { ParentCollection } from "./parent-collection"
import { IParentCollectionOptions } from "./parent-collection-options.interface"
import { FirestoreDocument } from "../core/firestore-document"



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
     * Builds the path to a document
     * @param modelOrId 
     * @returns 
     */
    public pathToDocument(modelOrId: IFirestormModel | string): string {
        const id = resolveId(modelOrId)
        if (!id) throw new MissingIdentifierError()

        return buildPath(this.collectionPath, id)
    }

    /**
     * Converts a snapshot to a model
     * @param documentSnapshot 
     * @returns 
     */
    public firestoreDocumentSnapshotToClass(
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
     * @param document 
     * @returns 
     */
    public documentToModel(document: FirestoreDocument): T {
        return this.typeMetadata.convertDocumentToModel(document)
    }

    /**
     * Converts multiple documents to their corresponding model
     * @param documents 
     * @returns 
     */
    public documentsToModels(documents: FirestoreDocument[]): T[] {
        return documents.map(d => this.documentToModel(d))
    }

    /**
     * Converts a partial model to a document
     * @param model 
     * @returns 
     */
    public modelToDocument(model: Partial<T>): FirestoreDocument {
        return this.typeMetadata.convertModelToDocument(model)
    }

    /**
     * Converts multiple models to their corresponding document
     * @param models 
     * @returns 
     */
    public modelsToDocuments(models: Partial<T>[]): FirestoreDocument[] {
        return models.map(m => this.modelToDocument(m))
    }
}