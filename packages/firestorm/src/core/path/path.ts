import { PathLike } from "."
import { CollectionDocumentTuples } from "./collection-document-tuples"
import { buildPath, toSegments } from "./path-as-string"


export const SpecialSegments = Object.freeze({
    root: '~',
    sibling: '.',
    parent: '..'
})

/**
 * Holds a more details version of a path information
 * 
 * Some segments have special meanings :
 * - '~' : signifies root. If a segment is exactly this, it will discard previous segments.
 * - '.' : signifies 'same level'. 
 * - '..': signifies 'parent level'
 */
export class Path {

    private _path: string = ""
    private _segments: string[] = []

    private constructor() {}

    /**
     * String the representing the path
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


    private rebuildPath() {
        this._path = buildPath(...this._segments)
    }

    public static fromString(pathString: string) {
        
        const p = new Path()

        p._segments = toSegments(pathString)
        p.rebuildPath()

        return p
    }

    public static fromSegments(segments: string[]) {
        return this.fromString(buildPath(...segments))
    }

    public static fromCollectionDocumentTuples(tuple: CollectionDocumentTuples) {
        return this.fromString(tuple.path)
    }

    public static fromPathLike(pathLike: PathLike | undefined): Path {

        if (pathLike === undefined || pathLike === null) {
            return Path.fromString("")
        }

        if (typeof pathLike === "string") {
            return Path.fromString(pathLike)
        }

        if (pathLike instanceof Path) {
            return pathLike
        }

        if (pathLike instanceof CollectionDocumentTuples) {
            return Path.fromString(pathLike.path)
        }

        throw new Error("Not supported path")

    }

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
        console.log(segments, normalizedSegments)

        return Path.fromSegments(normalizedSegments)
    }

}