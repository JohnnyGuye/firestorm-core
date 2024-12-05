import { FirestoreDocument } from "./firestore-document"
import { Type } from "./helpers"

/**
 * Minimal requirements for a firestorm model
 */
export interface IFirestormModel {

    /** Unique if of the document in this collection */
    id: string | null
    
}

/**
 * Requirements for a firestorm model that is referenced
 */
export interface IMandatoryFirestormModel extends IFirestormModel {
    
    id: string

}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FirestormModel = IFirestormModel
export type MandatoryFirestormModel = IMandatoryFirestormModel

/**
 * Take a firestorm model or an id and gets the id
 * @param modelOrId Model or id 
 * @returns An id
 */
export function resolveId(modelOrId: IFirestormModel | string) {
    return (typeof modelOrId !== "string" ? modelOrId.id : modelOrId)
}

/**
 * Take an instance of a model or an id and gets an instance
 * @param idOrModel Model or id
 * @param type Type of the model
 * @returns An instance of the model (same as given if it was already an instance)
 */
export function resolveInstance<T extends IFirestormModel>(
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
export type IdDictionary<T extends IFirestormModel> = Map<string, T>

/**
 * Explicit interface for subcollections.
 * 
 * Use it in conjonctions with the decorator SubCollection for clean type checking.
 */
export type ISubCollection<T extends IFirestormModel | IdDictionary<IFirestormModel> | IFirestormModel[]> = T

/**
 * Type of a conversion function from a FirestormModel to a firestore document data object
 */
export type ModelToDocumentConverter<T> = (model: T) => FirestoreDocument

/**
 * Type of a conversion function from a firestore document data object to a FirestormModel
 */
export type DocumentToModelConverter<T> = (documentData: FirestoreDocument) => T