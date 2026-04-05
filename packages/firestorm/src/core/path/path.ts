import { PathLike } from "."
import { logWarn } from "../logging"
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
 * Holds a more details version of a path information.
 * This object is readonly
 * 
 * Some segments have special meanings listed in {@link SpecialSegments}
 */
export class Path {

    private _path: string = ""
    private _pathToDeepestCollection: string | undefined
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
        return this.depth === 0
    }

    /**
     * The amount of full collection-document in the path
     */
    get documentDepth() {
        return this.depth >> 1
    }

    /**
     * The amount of segments composing the path
     */
    get depth() {
        return this._segments.length
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
        return (this.depth % 2) === 1
    }

    /**
     * If the path would land on a document
     */
    get isDocument() {
        return ((this.depth % 2) === 0) && !this.isRoot
    }

    /**
     * If the path would land on a collection that isn't a root collection
     */
    get isSubcollection() {
        return this.isCollection && !this.isRoot
    }

    /**
     * Gets the last segment of the path
     */
    get lastSegment() {
        if (this.isEmpty) return ""
        return this._segments[this._segments.length - 1]
    }

    /**
     * Gets all the segments in the path
     */
    get segments(): Readonly<string[]> {
        return this._segments
    }

    /**
     * Gets the path to the deepest collection this path can reach
     */
    get pathToDeepestCollection() {
        if (this._pathToDeepestCollection === undefined) {
            if (this.isEmpty) {
                this._pathToDeepestCollection = ""
                logWarn("This path has no collection level because it's empty.")
            }
            else if (this.isCollection) {
                this._pathToDeepestCollection = this._path
            } else {
                this._pathToDeepestCollection = Path.merge(this, "..").path
            }
        }
        return this._pathToDeepestCollection
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