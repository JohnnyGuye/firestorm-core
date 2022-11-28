import { Type } from "@angular/core"
import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { FIRESTORM_METADATA_STORAGE } from "../storage"

export interface ISubCollectionOptions<T> {

  collection?: string

  type: Type<T>

}


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