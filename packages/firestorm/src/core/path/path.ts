import { PathLike } from "."
import { CollectionDocumentTuples } from "./collection-document-tuples"
import { buildPath, toSegments } from "./path-as-string"

/**
 * Special path segments
 */
export const SpecialSegments = Object.freeze({
    /** signifies root. If a segment is exactly this, it will discard previous segments. */
    root: '~',
    /** signifies 'same level' */
    sibling: '.',
    /** signifies 'parent level' */
    parent: '..'
})

/**
 * Holds a more details version of a path information
 * 
 * Some segments have special meanings listed in {@link SpecialSegments}
 */
export class Path {

    private _path: string = ""
    private _segments: string[] = []

    private constructor() {}

    /**
     * String representing the path
     */
    get path() {
        return this._path
    }

    /**
     * If there is no path
     */
    get isEmpty() {
        return this._segments.length === 0
    }

    /**
     * The amount of full collection-document in the path
     */
    get documentDepth() {
        return this._segments.length >> 1
    }

    /**
     * If no collection-document couple is complete in the path
     */
    get isRoot() {
        return this.documentDepth == 0
    }

    /**
     * If the path would land on a collection
     */
    get isCollection() {
        return (this._segments.length % 2) === 1
    }

    /**
     * If the path would land on a document
     */
    get isDocument() {
        return ((this._segments.length % 2) === 0) && !this.isRoot
    }

    /**
     * If the path would land on a collection that isn't a root collection
     */
    get isSubcollection() {
        return this.isCollection && !this.isRoot
    }

    /** 
     * Rebuilds the path from the individual segments
     */
    private rebuildPath() {
        this._path = buildPath(...this._segments)
    }

    /**
     * Build a Path object from its string representation
     * @param pathString String representation of the path
     * @returns The path 
     */
    public static fromString(pathString: string) {
        
        const p = new Path()

        p._segments = toSegments(pathString)
        p.rebuildPath()

        return p
    }

    /**
     * Build a Path object from its segmented representation
     * @param segments Segmented representation of the path
     * @returns The path 
     */
    public static fromSegments(segments: string[]) {
        return this.fromString(buildPath(...segments))
    }

    /**
     * Build a Path object from its CollectionDocumentTuples representation.
     * 
     * @deprecated The CollectionDocumentTuples is no longer maintained or even supported.
     * 
     * @param tuples CollectionDocumentTuples representation of the path
     * @returns The path 
     */
    public static fromCollectionDocumentTuples(tuples: CollectionDocumentTuples) {
        return this.fromString(tuples.path)
    }

    /**
     * Converts the given object to path
     * @param pathLike Object to convert
     * @returns The path built
     */
    public static fromPathLike(pathLike: PathLike | undefined): Path {

        if (pathLike === undefined || pathLike === null) {
            return Path.fromString("")
        }

        if (typeof pathLike === "string") {
            return Path.fromString(pathLike)
        }

        if (pathLike instanceof Path) {
            return Path.fromString(pathLike.path)
        }

        if (pathLike instanceof Array) {
            return Path.fromSegments(pathLike)
        }

        throw new Error("Not supported path")

    }

    /**
     * Merges multiple path into one
     * @param pathLikes List of paths to merge.
     * @returns The merged paths
     */
    public static merge(...pathLikes: PathLike[]) {

        const paths = pathLikes.map(Path.fromPathLike)
        const segments = paths.flatMap(p => p._segments)

        const normalizedSegments: string[] = []

        for (let s of segments) {

            switch (s) {
                case SpecialSegments.root:
                    normalizedSegments.length = 0
                    break;
                case SpecialSegments.sibling:
                    break;
                case SpecialSegments.parent:
                    if (normalizedSegments.length > 0 && normalizedSegments[normalizedSegments.length - 1] != SpecialSegments.parent) {
                        normalizedSegments.pop()
                    } else {
                        normalizedSegments.push(s)
                    }
                    break;
                default:
                    normalizedSegments.push(s)
            }


        }

        return Path.fromSegments(normalizedSegments)
    }

}