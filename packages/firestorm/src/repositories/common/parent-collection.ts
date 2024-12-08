import { IFirestormModel, resolveInstance, Type } from "../../core"
import { FIRESTORM_METADATA_STORAGE } from "../../metadata-storage"
import { IParentCollectionOptions } from "./parent-collection-options.interface"

/**
 * For sub repositories of documents, this holds the informations of the parent document.
 */
export class ParentCollection<T_model extends IFirestormModel> {

    /**
     * Type of the model of the parent collection
     */
    readonly type: Type<T_model>
    /**
     * An instance of the model used as the parent document
     */
    readonly instance: T_model
    /**
     * @deprecated I don't know what the fck that is.
     */
    readonly key: string
    
    /**
     * Creates a {@link ParentCollection}
     * @param type Type of the documents in the parent collection
     * @param parent The parent document
     * @param key Some kind of league of legends?
     */
    protected constructor(type: Type<T_model>, parent: T_model, key: string) {
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

    /**
     * Factory of parent collection
     * @param options Creation options
     * @returns A parent collection
     */
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