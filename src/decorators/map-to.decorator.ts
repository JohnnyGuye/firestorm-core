import { FirestormModel } from "../core/firestorm-model"
import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { FIRESTORM_METADATA_STORAGE } from "../storage"

/**
 * Options for the decorator MapTo
 */
export interface IMapToOptions {
  
  /** Name of the document's field to map */
  target: string

}

/**
 * Decorator that changes the field in the document that is mapped to this instance.
 * 
 * @param options Options of the decorator or just the name of the document's field to map
 * @returns 
 */
export function MapTo(options: IMapToOptions | string) {

  if (typeof options === "string") options = { target: options }
  const localOptions = options

  return (object: FirestormModel, propertyKey: string) => {

    let storage: FirestormMetadataStorage = FIRESTORM_METADATA_STORAGE
    const md = storage.createOrGetMetadatas(object.constructor)
    md.addKeyRemapping(propertyKey, localOptions.target)

  }
}