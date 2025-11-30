import { Type } from "../../core/type"
import { FirestormMetadataStore } from "../../core/firestorm-metadata-store"
import { FirestormModel, IFirestormModel } from "../../core/firestorm-model"
import { FIRESTORM_METADATA_STORAGE } from "../../metadata-storage"

import { SubCollection } from "../common/sub-collection.decorator"
export { SubCollection as ISubCollection } from "../common/sub-collection.decorator"

/**
 * Base mandatory infos for all variations of options of the SubCollection decorator
 */
interface ISubCollectionOptionsBase {
    
  /** Path in firestore to the collection from the parent collection */
  collection?: string

}

/**
 * SubCollection decorator's options when the type isn't ready at the time of declaration
 */
export interface ISubCollectionOptionsLazy<T extends IFirestormModel> extends ISubCollectionOptionsBase {
  
  /** Forward ref to the model */
  forwardRef: () => Type<T>

}

/**
 * SubCollection decorator's options
 */
export interface ISubCollectionOptionsEager<T extends IFirestormModel> extends ISubCollectionOptionsBase {

  /** Type of the model assosciated */
  type: Type<T>

}


/**
 * Options for the decorator SubCollection
 */
export type ISubCollectionOptions<T extends IFirestormModel> 
  = ISubCollectionOptionsEager<T> 
  | ISubCollectionOptionsLazy<T>




function storeToMedata
  <
    T_model extends FirestormModel & Record<K, SubCollection<T_target_model>>,
    T_target_model extends IFirestormModel,
    K extends string
  >
  (
    object: T_model, 
    propertyName: string, 
    type: Type<T_target_model>, 
    collection?: string
  ) {
    
  const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
  const md = storage.getOrCreateMetadatas(object.constructor as Type<T_model>)

  md.addSubCollection(propertyName, type)
  md.addIgnoredProperty(propertyName)

  const submd = storage.getOrCreateMetadatas(type)
  submd.collection = collection || propertyName
  
}

/**
 * Decorator for subcollection.
 * Fields marked as subcollection are ignored in the model but they can be requested in sub repositories.
 * 
 * It behaves similarly to a combination of the decorator Ignore on the field and Collection of the given type.
 * 
 * @param options 
 * @returns 
 */
// T_Sub extends ISubCollection<T_Model>,
export function SubCollection<
  T_model extends FirestormModel & Record<K, SubCollection<T_target_model>>,
  T_target_model extends IFirestormModel,
  K extends string
  >(
  options: ISubCollectionOptions<T_target_model>
  ) {

  const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE

  if ("type" in options) {
  
    return (object: T_model, propertyName: K) => {      

      storeToMedata(object, propertyName, options.type, options.collection)
  
    }

  } else if ("forwardRef" in options) {
        
    return (object: T_model, propertyName: K) => {

      storage.registerForwardRef(
        options.forwardRef, 
        (type) => {
          storeToMedata(object, propertyName, type, options.collection)
        }
      )

    }

  }

  throw new Error("Not implemented")

}

