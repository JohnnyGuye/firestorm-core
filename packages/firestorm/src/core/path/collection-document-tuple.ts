import { FIRESTORM_METADATA_STORAGE } from "../../metadata-storage"
import { FirestormModel } from "../firestorm-model"
import { Type } from "../type"
import { buildPath } from "./path-as-string"

/**
 * @deprecated Prefer {@link Path}
 */
export class CollectionDocumentTuple<T extends FirestormModel> {

    private _instance?: T

    /**
     * @deprecated
     * @param collectionPath Segment of the collection
     * @param documentId Id of the document
     * @param type Expected type of the document
     */
    public constructor(
        public readonly collectionPath: string, 
        public readonly documentId: string, 
        public readonly type?: Type<T>
    ) {

    }

    /**
     * Instance of the model
     */
    get modelInstance() {

        if (!this.type) return null

        if (!this._instance) {
            const model = new this.type
            model.id = this.documentId
            this._instance = model
        }

        return this._instance
    }

    /**
     * Path represented by the tuple
     */
    get path() {
        return buildPath(this.collectionPath, this.documentId)
    }

    /**
     * The metadatas of the type of the parent collection
     */
    public get typeMetadata() {
        if (!this.type) return null
        return this.storage.getMetadatas(this.type)
    }

    /**
     * The global storage acces of metadatas
     */
    protected get storage() {
        return FIRESTORM_METADATA_STORAGE
    }

}