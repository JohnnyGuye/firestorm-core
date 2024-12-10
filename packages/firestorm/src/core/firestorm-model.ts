import { FirestoreDocument, FirestoreDocumentField } from "./firestore-document"
import { Type } from "./type"

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
   
    /** @inheritdoc */
    id: string

}
/** Alias of {@link IFirestormModel} */
export type FirestormModel = IFirestormModel

/** Alias of {@link IMandatoryFirestormModel} */
export type MandatoryFirestormModel = IMandatoryFirestormModel

/**
 * Take a firestorm model or an id and gets the id
 * @param modelOrId Model or id 
 * @returns An id
 */
export function resolveId(modelOrId: IMandatoryFirestormModel | string): string;
/**
 * Take a firestorm model or an id and gets the id
 * @param modelOrId Model or id 
 * @returns An id
 */
export function resolveId(modelOrId: IFirestormModel | string): string | null;
export function resolveId(modelOrId: IFirestormModel | string) {
    if (modelOrId === null) return null;
    if (typeof modelOrId === 'string') return modelOrId
    return modelOrId.id
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
 * @param model The model to convert
 * @returns The correspoding document to the model
 */
export type ModelToDocumentConverter<T> = (model: T) => FirestoreDocument

/**
 * Type of a conversion function from a FirestormModel to a firestore document data object
 * @param model The model to convert
 * @returns The correspoding document to the model
 */
export type ModelToDocumentFieldConverter<T> = (model: T) => FirestoreDocumentField

/**
 * Type of a conversion function from a firestore document data object to a FirestormModel
 * @param documentData The document to convert
 * @return The model corresponding to the document
 */
export type DocumentToModelConverter<T> = (documentData: FirestoreDocument) => T

/**
 * Type of a conversion function from a firestore document data object to a FirestormModel
 * @param documentData The document to convert
 * @return The model corresponding to the document
 */
export type DocumentToModelFieldConverter<T> = (documentData: FirestoreDocumentField) => T