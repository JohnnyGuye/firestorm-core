import { CollectionDocumentTuples } from "./collection-document-tuples"
import { Path } from "./path"

export * from "./path-as-string"
export * from "./collection-document-tuple"
export * from "./collection-document-tuples"
export * from "./path"

export type PathLike 
    = string 
    | Path
    | CollectionDocumentTuples

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