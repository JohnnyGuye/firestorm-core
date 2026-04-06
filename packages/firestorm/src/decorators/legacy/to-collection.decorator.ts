import { FIRESTORM_METADATA_STORAGE } from "../../metadata-storage";
import { FirestormMetadataStore, FirestormModel, ToCollectionRelationship, Type } from "../../core";
import { ToCollectionOptions, typeResolutionDispatcher } from "../common/options";

/**
 * Decorator for properties or fields that are linked to other collections
 * @param options 
 */
export function ToCollection
    <
    T_model extends FirestormModel & Record<K, ToCollectionRelationship<T_target_model>>,
    T_target_model extends FirestormModel,
    K extends string
    >(
        options: ToCollectionOptions<T_target_model>
    ) {

    return (object: T_model, propertyName: K) => {      
        
        typeResolutionDispatcher(
            options, 
            (targetType: Type<T_target_model>) => {
                
                const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
                const md = storage.getOrCreateMetadatas(object.constructor as Type<T_model>)

                md.addToCollectionRelationship(propertyName, targetType, options.location)
                md.addIgnoredProperty(propertyName)

            }
        )

    }

}