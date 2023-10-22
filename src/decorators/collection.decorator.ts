import { Type, pascalToSnakeCase, stringSingularToPlural } from "../core/helpers"
import { FirestormModel } from "../core/firestorm-model"
import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { logWarn } from "../core/logging"
import { FIRESTORM_METADATA_STORAGE } from "../metadata-storage"

/**
 * Options for the collection decorator
 */
export interface ICollectionOptions {
  
  /** Path to this collection in firestore */
  collection?: string

}

/**
 * Class decorator for a model.
 * 
 * This model's default local collection path can be specified through the options.
 * If not provided, it will take the classe's name and make it a plural. (/!\ doesn't work if the names are mangled at compilation)
 * 
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

      collectionName = stringSingularToPlural(pascalToSnakeCase(constructor.name))
      logWarn(
        `Auto collection path: ${collectionName}.\n`
        + ` It may be messed up by the uglification.\n` 
        + `You'll have to drop the name mangling for your model or state explicitely the collection.`)
    }

    let md = storage.createOrGetMetadatas(constructor)

    md.collection = collectionName
  }

}