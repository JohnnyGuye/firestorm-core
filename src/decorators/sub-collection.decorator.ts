import { Type } from "../core/helpers"
import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { FirestormModel, IFirestormModel } from "../core/firestorm-model"
import { FIRESTORM_METADATA_STORAGE } from "../metadata-storage"

export type { ISubCollection } from "../core/firestorm-model"

/**
 * Options for the decorator SubCollection
 */
export interface ISubCollectionOptions<T extends IFirestormModel> {

  /** Path in firestore to the collection from the parent collection */
  collection?: string

  /** Type of the model assosciated */
  type: Type<T>

}

/**
 * Decorator for subcollection.
 * Fields marked as subcollection are ignored in the model but they can be requested in sub repositories.
 * 
 * @warning the collection option is currently not used because it's not implemented correctly.
 * 
 * It behaves similarly to a combination of the decorator Ignore on the field and Collection of the given type.
 * 
 * @param options 
 * @returns 
 */
// T_Sub extends ISubCollection<T_Model>,
export function SubCollection<
  T_Host extends FirestormModel,
  T_Model extends IFirestormModel,
  K extends string
  >(
  options: ISubCollectionOptions<T_Model>
  ) {

  const type = options.type

  return (object: T_Host, propertyKey: K) => {

    const storage: FirestormMetadataStorage = FIRESTORM_METADATA_STORAGE
    const md = storage.getOrCreateMetadatas(object.constructor as Type<T_Host>)
    md.addSubCollection(propertyKey)

    const submd = storage.getOrCreateMetadatas(type)
    submd.collection = options.collection || propertyKey

  }

}