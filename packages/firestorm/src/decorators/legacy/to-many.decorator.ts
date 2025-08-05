import { FirestormMetadataStore, FirestormModel, Type } from "../../core"
import { FIRESTORM_METADATA_STORAGE } from "../../metadata-storage"
import { ToManyOptions } from "../common/relationship"

import { ToManyRelationship } from "../../core/relationship/to-many";
export { ToManyRelationship } from "../../core/relationship/to-many";

export function ToMany
    <
    T_model extends FirestormModel & Record<K, ToManyRelationship<T_target_model>>,
    T_target_model extends FirestormModel,
    K extends string
    >(
        options: ToManyOptions<T_target_model>
    ) {

    const targetType = options.target
    const location = options.location

    return (object: T_model, propertyName: K) => {

        const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
        const md = storage.getOrCreateMetadatas(object.constructor as Type<T_model>)
        md.addToManyRelationship(propertyName, targetType, location)

    }

}