import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage";

/**
 * The global instance storage of metadatas. 
 * Every metadatas necessary for firestom to work is stored here.
 */
export const FIRESTORM_METADATA_STORAGE = new FirestormMetadataStorage()

export function firestormMetadatasToJson() {

  const types = FIRESTORM_METADATA_STORAGE.registeredTypes
  const res = {
    metadas: types.map(type => {
      const md = FIRESTORM_METADATA_STORAGE.getMetadatas(type)
      return {
        collection: md.collection,
        document: md.documentBlueprint
      }
    })
  }
  return res
}