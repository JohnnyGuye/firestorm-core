import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { FIRESTORM_METADATA_STORAGE } from "../storage"

export function Ignore() {

  return (object: any, propertyKey: any) => {

    let storage: FirestormMetadataStorage = FIRESTORM_METADATA_STORAGE
    const md = storage.createOrGetMetadatas(object.constructor)
    md.addIgnoredKey(propertyKey)

  }
  
}