import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { pascalToSnakeCase } from "../core/helpers"
import { FIRESTORM_METADATA_STORAGE } from "../storage"

export interface ICollectionOptions {
  
  collection?: string

}

export function Collection(options?: ICollectionOptions) {
  console.log("COLLECTION DECORATOR")
  return (constructor: any) => {
    
    // Storage
    let storage: FirestormMetadataStorage = FIRESTORM_METADATA_STORAGE
    
    // Name of the collection
    let collectionName: string
    if (options && options.collection) {
      collectionName = options.collection
    } else {
      let snakeCaseName = pascalToSnakeCase(constructor.name)
      if (snakeCaseName.endsWith("y")) {
        snakeCaseName = snakeCaseName.substring(0, snakeCaseName.length - 1) + "ies"
      } else {
        snakeCaseName += "s"
      }
      collectionName = snakeCaseName
    }

    let md = storage.createOrGetMetadatas(constructor)

    md.collection = collectionName

    console.log(FIRESTORM_METADATA_STORAGE)
  }

}