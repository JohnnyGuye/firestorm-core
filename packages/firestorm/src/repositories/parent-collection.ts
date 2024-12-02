import { Type } from "../core/helpers"
import { FIRESTORM_METADATA_STORAGE } from "../metadata-storage"
import { IFirestormModel, resolveInstance } from "../core/firestorm-model"
import { IParentCollectionOptions } from "./parent-collection-options.interface"

/**
 * For sub repositories of documents, this holds the informations of the parent document.
 */
export class ParentCollection<T extends IFirestormModel> {

    readonly type: Type<T>
    readonly instance: T
    readonly key: string
    
    constructor(type: Type<T>, parent: T, key: string) {
        this.type = type
        this.instance = parent
        this.key = key
    }

    /**
     * The global storage acces of metadatas
     */
    protected get storage() {
        return FIRESTORM_METADATA_STORAGE
    }

    /**
     * The metadatas of the type of the parent collection
     */
    public get typeMetadata() {
        return this.storage.getMetadatas(this.type)
    }

    /**
     * The collection path of this parent collection
     */
    public get collection() {
        return this.typeMetadata.collection
    }

    /**
     * The id of the document of this parent collection
     */
    public get id() {
        return this.instance.id
    }

    public static createFromOptions<T extends IFirestormModel>(options: IParentCollectionOptions<T>) {
        if ("type" in options && "instance" in options && "key" in options) {
            return new ParentCollection(options.type, options.instance, options.key)
        }

        if ("type" in options && "id" in options && "key" in options) {
            return new ParentCollection(options.type, resolveInstance(options.id, options.type), options.key)
        }

        if ("type" in options && "instanceOrId" in options && "key" in options) {
            return new ParentCollection(options.type, resolveInstance(options.instanceOrId, options.type), options.key)
        }

        throw new Error("Not supported options")
    }
}