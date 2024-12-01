import { IFirestormModel, resolveInstance } from "../core/firestorm-model"
import { Type } from "../core/helpers"
import { FIRESTORM_METADATA_STORAGE } from "../metadata-storage"
import { IParentCollectionOption } from "./parent-collection.interface"

// Technically I could infer the type from the instance T. There is probably a way aswell to not use the key though it may be complicated

/*
### Should be possible if T only has one matching subcollection matching this model

interface IParentCollectionSetOne<T extends FirestormModel> {
    instance: T
}

### Should be always possible

interface IParentCollectionSetTwo<T extends FirestormModel> {
    instance: T
    key: string
}

### Should also be viable you don't need an actual instance if you give the type, you just need the id

interface IParentCollectionSetThree<T extends FirestormModel> {
    type: Type<T>
    partialInstanceOrId: FirestormModel | string
    key: string
}
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

    protected get storage() {
        return FIRESTORM_METADATA_STORAGE
    }

    public get typeMetadata() {
        return this.storage.getMetadatas(this.type)
    }

    public get collection() {
        return this.typeMetadata.collection
    }

    public get id() {
        return this.instance.id
    }

    public static createFromOptions<T extends IFirestormModel>(options: IParentCollectionOption<T>) {
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