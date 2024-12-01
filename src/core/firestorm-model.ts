import { Type } from "./helpers"

/**
 * Minimal requirements for a firestorm model
 */
export interface FirestormModel {

    /** Unique if of the document in this collection */
    id: string | null
    
}

/**
 * Requirements for a firestorm model that is referenced
 */
export interface MandatoryFirestormModel extends FirestormModel {
    
    id: string

}

/**
 * Take a firestorm model or an id and gets the id
 * @param modelOrId Model or id 
 * @returns An id
 */
export function resolveId(modelOrId: FirestormModel | string) {
    return (typeof modelOrId !== "string" ? modelOrId.id : modelOrId)
}

/**
 * Take an instance of a model or an id and gets an instance
 * @param idOrModel Model or id
 * @param type Type of the model
 * @returns An instance of the model (same as given if it was already an instance)
 */
export function resolveInstance<T extends FirestormModel>(
    idOrModel: T | string, 
    type: Type<T>
    ): T {
  
    if (typeof idOrModel !== 'string') return idOrModel
  
    const instance: T = new type()
    instance.id = idOrModel
    
    return instance
  }

/**
 * Dictionary of id and model corresponding to this id
 */
export type IdDictionary<T extends FirestormModel> = Map<string, T>

/**
 * Explicit interface for subcollections.
 * 
 * Use it in conjonctions with the decorator SubCollection for clean type checking.
 */
export type ISubCollection<T extends FirestormModel | IdDictionary<FirestormModel> | FirestormModel[]> = T

/**
 * Type of a conversion function from a FirestormModel to a firestore document data object
 */
export type ModelToDocumentConverter<T> = (model: T) => any

/**
 * Type of a conversion function from a firestore document data object to a FirestormModel
 */
export type DocumentToModelConverter<T> = (documentData: any) => T