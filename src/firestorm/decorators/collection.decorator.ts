import { Type } from "@angular/core"
import { FirestormModel } from "@firestorm/core/firestorm-model"
import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { pascalToSnakeCase } from "../core/helpers"
import { logWarn } from "../core/logging"
import { FIRESTORM_METADATA_STORAGE } from "../storage"

/**
 * Options for the collection decorator
 */
export interface ICollectionOptions {
  
  /** Path to this collection in firestore */
  collection?: string

}

/**
 * Class decorator for a model.
 * @param options Options of the collection
 */
export function Collection<T extends FirestormModel>(options?: ICollectionOptions) {
  return (constructor: Type<T>) => {
    
    // Storage
    let storage: FirestormMetadataStorage = FIRESTORM_METADATA_STORAGE
    
    // Name of the collection
    let collectionName: string
    if (options && options.collection) { // Explicit naming
      collectionName = options.collection
    } else { // Not explicit naming
      let snakeCaseName = pascalToSnakeCase(constructor.name)
      if (snakeCaseName.endsWith("y")) {
        snakeCaseName = snakeCaseName.substring(0, snakeCaseName.length - 1) + "ies"
      } else {
        snakeCaseName += "s"
      }
      collectionName = snakeCaseName
      logWarn(
        `Auto collection path: ${collectionName}.\n`
        + ` It may be messed up by the uglification.\n` 
        + `You'll have to drop the name mangling for your model or state explicitely the collection.`)
    }

    let md = storage.createOrGetMetadatas(constructor)

    md.collection = collectionName
  }

}