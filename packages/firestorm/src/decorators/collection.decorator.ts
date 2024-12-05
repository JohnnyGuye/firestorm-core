import { Type, pascalToSnakeCase, stringSingularToPlural } from "../core/helpers"
import { FirestormModel } from "../core/firestorm-model"
import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { logWarn } from "../core/logging"
import { FIRESTORM_METADATA_STORAGE } from "../metadata-storage"
import { ClassDecoratorReturn } from "./decorator-utilities"

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
 * Not providing the collection will take the classe's name and make it a snake_case_plural. 
 * 
 * @deprecated Doesn't work if the names are mangled at compilation.
 */
export function Collection<T extends FirestormModel>(): ClassDecoratorReturn<T>;
/**
 * Class decorator for a model.
 * 
 * This model's default local collection path can be specified through the options.
 * 
 * @param options Options of the collection
 */
export function Collection<T extends FirestormModel>(options: ICollectionOptions): ClassDecoratorReturn<T>;
export function Collection<T extends FirestormModel>(options?: ICollectionOptions): ClassDecoratorReturn<T> {
  return (constructor: Type<T>) => {
    
    // Storage
    const storage: FirestormMetadataStorage = FIRESTORM_METADATA_STORAGE
    
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

    const md = storage.getOrCreateMetadatas(constructor)

    md.collection = collectionName
  }

}