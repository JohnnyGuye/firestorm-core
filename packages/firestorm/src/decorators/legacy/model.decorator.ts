import { Type, pascalToSnakeCase, stringSingularToPlural } from "../../core"
import { FirestormModel } from "../../core/firestorm-model"
import { FirestormMetadataStore } from "../../core/firestorm-metadata-store"
import { logWarn } from "../../core/logging"
import { FIRESTORM_METADATA_STORAGE } from "../../metadata-storage"
import { ClassDecoratorReturn } from "./decorator-utilities"

/**
 * Full options for the collection decorator
 */
export interface IModelOptions {
  
  /** Path to this collection in firestore */
  collection?: string

}

/**
 * Options for the collection decorator
 */
export type ModelOptions 
  = 'string' | IModelOptions

/**
 * Class decorator for a model.
 * 
 * Not providing the collection will take the classe's name and make it a snake_case_plural. 
 * 
 * @deprecated Doesn't work if the names are mangled at compilation. Only use it when prototyping. 
 * It might be entirely removed in later versions.
 */
export function Model<T extends FirestormModel>(): ClassDecoratorReturn<T>;
/**
 * Class decorator for a model.
 * 
 * @param collection Path to this collection in firestore
 */
export function Model<T extends FirestormModel>(collection: string): ClassDecoratorReturn<T>;
/**
 * Class decorator for a model.
 * 
 * This model's default local collection path can be specified through the options.
 * 
 * @param options Options of the collection
 */
export function Model<T extends FirestormModel>(options: ModelOptions): ClassDecoratorReturn<T>;
export function Model<T extends FirestormModel>(options?: ModelOptions | string): ClassDecoratorReturn<T> {
  return (constructor: Type<T>) => {
    
    // Storage
    const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
    
    // Name of the collection
    let collectionName: string = extractCollectionName(constructor, options)

    const md = storage.getOrCreateMetadatas(constructor)
    md.collection = collectionName

  }

}

function extractCollectionName<T extends FirestormModel>(constructor: Type<T>, options?: ModelOptions | string) {

  if (typeof options === "string") {
    
    return options

  } else if (options && options.collection) { // Explicit naming

    return options.collection
    
  } else { // Not explicit naming

    let collectionName = stringSingularToPlural(pascalToSnakeCase(constructor.name))
    logWarn(
      `Auto collection path: ${collectionName}.\n`
      + ` It may be messed up by the uglification.\n` 
      + `You'll have to drop the name mangling for your model or state explicitely the collection.`
    )

    return collectionName
  }

}