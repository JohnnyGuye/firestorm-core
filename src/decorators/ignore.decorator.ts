import { FirestormModel } from "../core/firestorm-model"
import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { FIRESTORM_METADATA_STORAGE } from "../metadata-storage"

/**
 * Decorator for fields that are in the model but you don't want to match in the firestore document.
 * 
 * Notably computed properties, or the id when you don't want it in the document.
 * 
 * @returns 
 */
export function Ignore() {

  return (object: FirestormModel, propertyKey: string) => {

    const storage: FirestormMetadataStorage = FIRESTORM_METADATA_STORAGE
    const md = storage.createOrGetMetadatas(object.constructor)
    md.addIgnoredKey(propertyKey)

  }
  
}