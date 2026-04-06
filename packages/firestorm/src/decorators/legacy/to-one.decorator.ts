import { FirestormMetadataStore, FirestormModel, Type } from "../../core"
import { FIRESTORM_METADATA_STORAGE } from "../../metadata-storage"
import { ToOneOptions, typeResolutionDispatcher } from "../common/options"

import { ToOneRelationship } from "../../core/relationship"
export { ToOneRelationship } from "../../core/relationship"

/**
 * Decorator for properties or field that reference an other document.
 * 
 * It has to be used on a property or field which has a {@link ToOneRelationship} type
 * @param options Options for toone
 * @returns 
 */
export function ToOne
  <
  T_model extends FirestormModel & Record<K, ToOneRelationship<T_target_model>>,
  T_target_model extends FirestormModel,
  K extends string
  >(
    options: ToOneOptions<T_target_model>
  ) {

    return (object: T_model, propertyName: K) => {
        
        typeResolutionDispatcher(
            options,
            (targetType: Type<T_target_model>) => {

                const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
                const md = storage.getOrCreateMetadatas(object.constructor as Type<T_model>)
                md.addToOneRelationship(propertyName, targetType, options.location)

            }
        )

    }

}
