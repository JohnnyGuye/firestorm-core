import { FirestormModel } from "../firestorm-model"
import { CollectionDocumentTuple } from "./collection-document-tuple"
import { buildPath, toSegments } from "./path-as-string"

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
