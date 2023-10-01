import { DocumentSnapshot, Firestore } from "firebase/firestore"

import { Type, buildPath } from "../core/helpers"
import { FirestormModel, resolveId } from "../core/firestorm-model"
import { FIRESTORM_METADATA_STORAGE } from "../storage"
import { MissingIdentifierError } from "../errors"

import { ParentCollection } from "./parent-collection"
import { IParentCollection } from "./parent-collection.interface"



/**
 * A repository is a typed access to a specific collection
 */
export class BaseRepository<T extends FirestormModel> {
        
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
     * Gets the name of the type.
     * 
     * Warning: don't rely on its result to do stuff, the name will get mangled after compilation.
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

    public pathToDocument(modelOrId: FirestormModel | string): string {
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

        const klass = this.firestoreDocumentToClass(data)
        if (!klass) {
            console.error("Failed to convert the document to a typed object:", retrievedId, data)
            throw Error(`Failed to convert the document of id '${retrievedId}' in colleciton ${this.collectionPath}`)
        }

        klass.id = retrievedId

        return klass
    }

    /**
     * Converts a document to a model (if the id is not in the document, it is lost in the process)
     * @param document 
     * @returns 
     */
    public firestoreDocumentToClass(document: any): T | null {
        return this.typeMetadata.convertDocumentToModel(document)
    }

    /**
     * Converts a partial model to a document
     * @param object 
     * @returns 
     */
    public classToFirestoreDocument(object: Partial<T>): any {
        return this.typeMetadata.convertModelToDocument(object)
    }
}