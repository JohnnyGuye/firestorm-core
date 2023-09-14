/**
 * Minimal requirements for a firestorm model
 */
export interface FirestormModel {

    /** Unique if of the document in this collection */
    id: string | null
    
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