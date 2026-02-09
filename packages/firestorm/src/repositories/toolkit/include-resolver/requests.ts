import { Path, Type } from "../../../core"

export enum RequestType {

    FullCollection,
    Document

}

export interface Request<T> {

    requestType: RequestType

    path: Path

    type: Type<T>
}

export class CollectionRequest<T>  implements Request<T> {

    requestType = RequestType.FullCollection

    constructor(public type: Type<T>, public path: Path) {}

}

export class DocumentRequest<T>  implements Request<T> {

    requestType = RequestType.FullCollection

    constructor(public type: Type<T>, public path: Path) {}

}