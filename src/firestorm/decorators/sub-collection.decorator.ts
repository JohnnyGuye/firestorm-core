import { Type } from "@angular/core"
import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { FIRESTORM_METADATA_STORAGE } from "../storage"

/**
 * Options for the decorator SubCollection
 */
export interface ISubCollectionOptions<T> {

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
export function SubCollection<T>(options: ISubCollectionOptions<T>) {

  let type = options.type

  return (object: any, propertyKey: any) => {

    let storage: FirestormMetadataStorage = FIRESTORM_METADATA_STORAGE
    const md = storage.createOrGetMetadatas(object.constructor)
    md.addSubCollection(propertyKey)

    let submd = storage.createOrGetMetadatas(type)
    submd.collection = propertyKey

  }

}