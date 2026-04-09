import { FIRESTORM_METADATA_STORAGE } from "../../../metadata-storage"
import { FirestormMetadataStore, FirestormModel, Type } from "../../../core"
import { ToManyOptions, typeResolutionDispatcher } from "../../common/options"

import { ToManyRelationship } from "../../../core/relationship/to-many";
export { ToManyRelationship } from "../../../core/relationship/to-many";

/**
 * Decorator for properties or field taht reference multiple documents
 * @param options 
 * @returns 
 */
export function ToMany
    <
    T_model extends FirestormModel & Record<K, ToManyRelationship<T_target_model>>,
    T_target_model extends FirestormModel,
    K extends string
    >(
        options: ToManyOptions<T_target_model>
    ) {

    return (object: T_model, propertyName: K) => {
        
        typeResolutionDispatcher(
            options,
            (targetType: Type<T_target_model>) => {

                const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
                const md = storage.getOrCreateMetadatas(object.constructor as Type<T_model>)
                md.addToManyRelationship(propertyName, targetType, options.location)

            }
        )

    }

}