import { Path, PathLike, Type } from "../../../core"

/**
 * Type of the request.
 * The value associated to them is their priority order
 */
export enum RequestType {

    FullCollection = 1,
    Document = 2

}

export interface Request<T> {

    /**
     * Type of the request
     */
    readonly requestType: RequestType

    /**
     * Path to the ressource
     */
    readonly path: Path

    /**
     * Type of the ressource
     */
    readonly type: Type<T>
}

export class CollectionRequest<T>  implements Request<T> {

    public readonly requestType = RequestType.FullCollection

    public readonly path: Path

    constructor(public type: Type<T>, basePath: Path, relativePath?: PathLike) {
        this.path = Path.merge(basePath, relativePath || "")
    }

}

export class DocumentRequest<T>  implements Request<T> {

    public readonly requestType = RequestType.Document

    public readonly path: Path

    constructor(public type: Type<T>, basePath: Path, relativePath?: PathLike) {
        this.path = Path.merge(basePath, relativePath || "")
    }

}

/**
 * Evaluates the priority of a request compared to another
 * @param lhs The left request to compare
 * @param rhs The right request to compare
 * @returns A number such as :
 * - 0: if the requests have the same priority
 * - &lt; 0: if the left request has a higher priority
 * - &gt; 0: if the right request has a higher priority
 */
export function priorityComparer(lhs: Request<unknown>, rhs: Request<unknown>): number {
    const typePriority = lhs.requestType - rhs.requestType
    if (typePriority != 0) return typePriority

    const pathDepthPriority = lhs.path.depth - rhs.requestType
    if (pathDepthPriority != 0) return pathDepthPriority

    const lexicographicPriority = lhs.path.path.localeCompare(rhs.path.path)
    return lexicographicPriority
}