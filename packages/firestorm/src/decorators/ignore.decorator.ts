import { FirestormModel } from "../core/firestorm-model"
import { FirestormMetadataStore } from "../core/firestorm-metadata-store"
import { FIRESTORM_METADATA_STORAGE } from "../metadata-storage"
import { Type } from "../core/type"

/**
 * Decorator for fields that are in the model but you don't want to match in the firestore document.
 * 
 * Notably computed properties, or the id when you don't want it in the document.
 * 
 * @returns 
 */
export function Ignore<M extends FirestormModel>() {

  return (object: M, propertyKey: string) => {

    const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
    const md = storage.getOrCreateMetadatas(object.constructor as Type<M>)
    md.addIgnoredKey(propertyKey)

  }
  
}