import { FIRESTORM_METADATA_STORAGE } from "../../metadata-storage"
import { FirestormModel } from "../firestorm-model"
import { Type } from "../type"
import { buildPath } from "./path-as-string"

export class CollectionDocumentTuple<T extends FirestormModel> {

    private _instance?: T

    /**
     * 
     * @param collectionPath 
     * @param documentId 
     * @param type 
     */
    public constructor(
        public readonly collectionPath: string, 
        public readonly documentId: string, 
        public readonly type?: Type<T>
    ) {

    }

    get modelInstance() {
        if (!this.type) return null
        if (!this._instance) {
            const model = new this.type
            model.id = this.documentId
            this._instance = model
        }
        return this._instance
    }

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