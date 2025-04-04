import { FIRESTORM_METADATA_STORAGE } from "../metadata-storage"
import { FirestormModel } from "./firestorm-model"
import { buildPath, toSegments } from "./path"
import { Type } from "./type"

export class CollectionDocumentTuple<T extends FirestormModel> {

    private _instance?: T

    /**
     * 
     * @param collectionPath 
     * @param documentId 
     * @param type 
     */
    public constructor(
        public readonly collectionPath: string, 
        public readonly documentId: string, 
        public readonly type?: Type<T>
    ) {

    }

    get modelInstance() {
        if (!this.type) return null
        if (!this._instance) {
            const model = new this.type
            model.id = this.documentId
            this._instance = model
        }
        return this._instance
    }

    get path() {
        return buildPath(this.collectionPath, this.documentId)
    }

    /**
     * The metadatas of the type of the parent collection
     */
    public get typeMetadata() {
        if (!this.type) return null
        return this.storage.getMetadatas(this.type)
    }

    /**
     * The global storage acces of metadatas
     */
    protected get storage() {
        return FIRESTORM_METADATA_STORAGE
    }

}

export class CollectionDocumentTuples {

    private _tuples: CollectionDocumentTuple<FirestormModel>[] = []

    /**
     * Creates a new empty collection document tuple
     */
    public constructor();
    /**
     * Creates a new 
     * @param tuples 
     */
    public constructor(tuples?: CollectionDocumentTuple<FirestormModel>);
    public constructor(tuples?: CollectionDocumentTuple<FirestormModel>[]);
    public constructor(tuples?: CollectionDocumentTuples);
    public constructor(tuples?: CollectionDocumentTuple<FirestormModel>[] | CollectionDocumentTuples | CollectionDocumentTuple<FirestormModel>) {

        if (!tuples) {
            this._tuples = []
        } else if (tuples instanceof Array) {
            this._tuples = tuples
        } else if (tuples instanceof CollectionDocumentTuple) {
            this._tuples = [tuples]
        } else {
            this._tuples = tuples._tuples
        }
    }

    public get tuples() {
        return this._tuples
    }

    get path() {
        return buildPath(...this.tuples.map(tuple => tuple.path))
    }

    get depth() {
        return this.tuples.length
    }
    
    get isRoot() {
        return this.depth == 0
    }

    get isSubcollection() {
        return !this.isRoot
    }
    
    moveUp() {
        return new CollectionDocumentTuples(this.depth > 0 ? this.tuples.slice(0, -1): [])
    }

    moveDown<T extends FirestormModel>(tuple: CollectionDocumentTuple<T>) {
        return new CollectionDocumentTuples([...this.tuples, tuple])
    }

    public static fromPath(path: string) {
        const segments = toSegments(path)
        if (segments.length % 2) {
            segments.pop()
        }
        
        const tuples = []
        for (let i = 0; i < segments.length; i+=2) {
            tuples.push(new CollectionDocumentTuple(segments[i], segments[i+1]))
        }
        
        return new CollectionDocumentTuples(tuples)
    }
}