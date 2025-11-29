import { CollectionDocumentTuples } from "./collection-document-tuples"
import { Path } from "./path"

export * from "./path-as-string"
export * from "./collection-document-tuple"
export * from "./collection-document-tuples"
export * from "./path"

/**
 * Objects that can represent a path
 */
export type PathLike 
    = string 
    | Path
    | CollectionDocumentTuples

/**
 * Converts the given object to path.
 * 
 * Unlike {@link Path.fromPathLike}, it returns the same path object if the object was already a path.
 * 
 * @param pathLike Object to convert
 * @returns The path built
 */
export function resolveToPath(pathLike: PathLike | undefined) {

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