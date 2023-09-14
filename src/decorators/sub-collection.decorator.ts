import { Type } from "../core/helpers"
import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { FirestormModel, ISubCollection } from "../core/firestorm-model"
import { FIRESTORM_METADATA_STORAGE } from "../storage"

export { ISubCollection } from "../core/firestorm-model"

/**
 * Options for the decorator SubCollection
 */
export interface ISubCollectionOptions<T extends FirestormModel> {

  /** Path in firestore to the collection from the parent collection */
  collection?: string

  /** Type of the model assosciated */
  type: Type<T>

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
export function SubCollection<
  T_Host extends FirestormModel,
  T_Sub extends ISubCollection<T_Model>,
  T_Model extends FirestormModel,
  K extends string
  >(
  options: ISubCollectionOptions<T_Model>
  ) {

  let type = options.type

  return (object: T_Host, propertyKey: K) => {

    let storage: FirestormMetadataStorage = FIRESTORM_METADATA_STORAGE
    const md = storage.createOrGetMetadatas(object.constructor)
    md.addSubCollection(propertyKey)

    let submd = storage.createOrGetMetadatas(type)
    submd.collection = options.collection || propertyKey

  }

}