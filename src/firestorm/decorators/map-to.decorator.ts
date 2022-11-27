import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { FIRESTORM_METADATA_STORAGE } from "../storage"

export interface IMapToOptions {
  
  target: string

}

export function MapTo(options: IMapToOptions | string) {

  if (typeof options === "string") options = { target: options }
  const localOptions = options

  return (object: any, propertyKey: any) => {

    let storage: FirestormMetadataStorage = FIRESTORM_METADATA_STORAGE
    const md = storage.createOrGetMetadatas(object.constructor)
    md.addKeyRemapping(propertyKey, localOptions.target)

  }
}