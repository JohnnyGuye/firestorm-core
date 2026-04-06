import { Path, PathLike } from "./path"

export * from "./path-as-string"
export * from "./path"


/**
 * Converts the given object to path.
 * 
 * Unlike {@link Path.fromPathLike}, it returns the same path object if the object was already a path.
 * 
 * @param pathLike Object to convert
 * @returns The path built
 */
export function coerceToPath(pathLike: PathLike | undefined) {

    if (pathLike === undefined || pathLike === null) {
        return Path.fromString("")
    }

    if (typeof pathLike === "string") {
        return Path.fromString(pathLike)
    }

    if (pathLike instanceof Path) {
        return pathLike
    }

    if (pathLike instanceof Array) {
        return Path.fromSegments(pathLike)
    }

    throw new Error("Not supported path")

}