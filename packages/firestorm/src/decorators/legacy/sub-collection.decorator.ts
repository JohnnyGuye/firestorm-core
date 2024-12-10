import { Type } from "../../core/type"
import { FirestormMetadataStore } from "../../core/firestorm-metadata-store"
import { FirestormModel, IFirestormModel, ISubCollection } from "../../core/firestorm-model"
import { FIRESTORM_METADATA_STORAGE } from "../../metadata-storage"

export type { ISubCollection } from "../../core/firestorm-model"

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
 * It behaves similarly to a combination of the decorator Ignore on the field and Collection of the given type.
 * 
 * @param options 
 * @returns 
 */
// T_Sub extends ISubCollection<T_Model>,
export function SubCollection<
  T_model extends FirestormModel & Record<K, ISubCollection<T_target_model>>,
  T_target_model extends IFirestormModel,
  K extends string
  >(
  options: ISubCollectionOptions<T_target_model>
  ) {

  const type = options.type

  return (object: T_model, propertyName: K) => {

    const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
    const md = storage.getOrCreateMetadatas(object.constructor as Type<T_model>)
    md.addSubCollection(propertyName, type)

    const submd = storage.getOrCreateMetadatas(type)
    submd.collection = options.collection || propertyName

  }

}