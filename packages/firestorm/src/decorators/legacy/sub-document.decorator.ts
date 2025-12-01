import { FirestormMetadataStore, FirestormModel, pascalToSnakeCase, Type } from "../../core"
import { SubDocument } from "../common/sub-collection.decorator"
import { FIRESTORM_METADATA_STORAGE } from "../../metadata-storage"

/**
 * Base mandatory infos for all variations of options of the SubDocument decorator
 */
interface ISubDocumentOptionsBase {

    /**
     * Path in firestore to the collection from the parent collection.
     * If not provided, it's gonna use the type's collection
     */
    collection?: string
    
    /**
     * The id of the document
     */
    documentId: string 

}


/**
 * SubDocument decorator's options when the type isn't ready at the time of declaration
 */
export interface ISubDocumentOptionsLazy<T extends FirestormModel> extends ISubDocumentOptionsBase {
  
  /** Forward ref to the model */
  forwardRef: () => Type<T>

}

/**
 * SubDocument decorator's options
 */
export interface ISubDocumentOptionsEager<T extends FirestormModel> extends ISubDocumentOptionsBase {

  /** Type of the model assosciated */
  type: Type<T>

}

export type ISubDocumentOptions<T extends FirestormModel>
    = ISubDocumentOptionsEager<T>
    | ISubDocumentOptionsLazy<T>



function storeToMedata
  <
    T_model extends FirestormModel & Record<K, SubDocument<T_target_model>>,
    T_target_model extends FirestormModel,
    K extends string
  >
  (
    object: T_model, 
    propertyName: string, 
    type: Type<T_target_model>, 
    collection: string | undefined,
    documentId: string
  ) {
    
  const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
  const md = storage.getOrCreateMetadatas(object.constructor as Type<T_model>)
  
  md.addDocumentRelationship(propertyName, type, documentId)
  md.addIgnoredProperty(propertyName)

  const submd = storage.getOrCreateMetadatas(type)
  submd.collection = collection || submd.collection || pascalToSnakeCase(propertyName)
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
export function SubDocument<
  T_model extends FirestormModel & Record<K, SubDocument<T_target_model>>,
  T_target_model extends FirestormModel,
  K extends string
  >(
  options: ISubDocumentOptions<T_target_model>
  ) {

  const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE

  if ("type" in options) {
  
    return (object: T_model, propertyName: K) => {      

      storeToMedata(object, propertyName, options.type, options.collection, options.documentId)
  
    }

  } else if ("forwardRef" in options) {
        
    return (object: T_model, propertyName: K) => {

      storage.registerForwardRef(
        options.forwardRef, 
        (type) => {
          storeToMedata(object, propertyName, type, options.collection, options.documentId)
        }
      )

    }

  }

  throw new Error("Not implemented")

}