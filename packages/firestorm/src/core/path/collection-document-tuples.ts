import { FirestormModel } from "../firestorm-model"
import { CollectionDocumentTuple } from "./collection-document-tuple"
import { buildPath, toSegments } from "./path-as-string"

/**
 * @deprecated Prefer {@link Path}
 */
export class CollectionDocumentTuples {

    private _tuples: CollectionDocumentTuple<FirestormModel>[] = []

    /**
     * Creates a new empty collection document tuple
     * @deprecated
     */
    public constructor();
    /**
     * Creates a new
     * @deprecated
     * @param tuples ...
     */
    public constructor(tuples?: CollectionDocumentTuple<FirestormModel>);
    /**
     * @deprecated
     * @param tuples ...
     */
    public constructor(tuples?: CollectionDocumentTuple<FirestormModel>[]);
    /**
     * @deprecated
     * @param tuples ...
     */
    public constructor(tuples?: CollectionDocumentTuples);
    /**
     * @deprecated
     * @param tuples ...
     */
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

    /**
     * List of collection-document tuples
     */
    public get tuples() {
        return this._tuples
    }

    /**
     * String representing the path
     */
    get path() {
        return buildPath(...this.tuples.map(tuple => tuple.path))
    }

    /**
     * The amount of collection-document tuples
     */
    get depth() {
        return this.tuples.length
    }

    /**
     * If no collection-document couple is complete in the path
     */
    get isRoot() {
        return this.depth == 0
    }

    /**
     * If the path would land on a collection that isn't a root collection
     */
    get isSubcollection() {
        return !this.isRoot
    }
    
    /**
     * Creates a new CollectionDocumentTuples with one less collection-document at the end
     * @returns The new CollectionDocumentTuples
     */
    moveUp() {
        return new CollectionDocumentTuples(this.depth > 0 ? this.tuples.slice(0, -1): [])
    }

    /**
     * Creates a new CollectionDocumentTuples with a child tuple
     * @param tuple Tuple to add
     * @returns The new CollectionDocumentTuples
     */
    moveDown<T extends FirestormModel>(tuple: CollectionDocumentTuple<T>) {
        return new CollectionDocumentTuples([...this.tuples, tuple])
    }

    /**
     * Creates a CollectionDocumentTuples from 
     * @param path The string representation of the CollectionDocumentTuples
     * @returns The new CollectionDocumentTuples
     */
    public static fromPath(path: string): CollectionDocumentTuples {

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
