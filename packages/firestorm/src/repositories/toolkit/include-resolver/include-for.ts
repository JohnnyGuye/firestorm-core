import { FirestormModel, Path, PathLike } from "../../../core"

/**
 * Includer that is used by the include resolver to tell which models are requesting other documents and were they are.
 * @template T_model The full type of the model
 * @template T_partial The partial version of the model
 */
export class IncludeFor<T_model extends FirestormModel, T_partial extends Partial<T_model>> {
    
    /**
     * The path to the collection this document is in
     */
    public readonly collectionPath: Path

    /**
     * The full path to the document
     */
    public readonly documentPath: Path

    /**
     * Creates an includer
     * @param model Model that requests includes
     * @param collectionPath Path to the collection of the model
     */
    constructor(public model: T_partial, collectionPath: PathLike) {
        
        this.collectionPath = Path.fromPathLike(collectionPath)

        if (!model.id) {
            throw new Error("Can't resolve the document path of this include, it doesn't have an id.")
        }

        this.documentPath = Path.merge(this.collectionPath, model.id)

    }

}