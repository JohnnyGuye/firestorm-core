import { FirestormModel } from "../core/firestorm-model"
import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { FIRESTORM_METADATA_STORAGE } from "../metadata-storage"
import { Type } from "../core/helpers"

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
export function MapTo<M extends FirestormModel>(options: IMapToOptions | string) {

  if (typeof options === "string") options = { target: options }
  const localOptions = options

  return (object: M, propertyKey: string) => {

    const storage: FirestormMetadataStorage = FIRESTORM_METADATA_STORAGE
    const md = storage.getOrCreateMetadatas(object.constructor as Type<M>)
    md.addKeyRemapping(propertyKey, localOptions.target)

  }
}