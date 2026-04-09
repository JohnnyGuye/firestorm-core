import { FIRESTORM_METADATA_STORAGE } from "../../../metadata-storage";
import { FirestormMetadataStore, FirestormModel, ToDocumentRelationship, Type } from "../../../core";
import { ToDocumentOptions, typeResolutionDispatcher } from "../../common/options";

/**
 * Decorator for properties or fields that are linked to other collections
 * @param options 
 */
export function ToDocument
    <
    T_model extends FirestormModel & Record<K, ToDocumentRelationship<T_target_model>>,
    T_target_model extends FirestormModel,
    K extends string
    >(
        options: ToDocumentOptions<T_target_model>
    ) {

    return (object: T_model, propertyName: K) => {      
        
        typeResolutionDispatcher(
            options, 
            (targetType: Type<T_target_model>) => {
                
                const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
                const md = storage.getOrCreateMetadatas(object.constructor as Type<T_model>)

                md.addToDocumentRelationship(propertyName, targetType, options.location, options.documentId)
                md.addIgnoredProperty(propertyName)

            }
        )

    }

}