/**
 * Minimal requirements for a firestorm model
 */
export interface FirestormModel {

    id: string | null
    
}

/**
 * Explicit interface for subcollections.
 * 
 * It currently is an empty interface and it may stay like that but use it anyway, at the very least to self document your code.
 */
export interface ISubcollection<T> {

}

/**
 * Type of a conversion function from a FirestormModel to a firestore document data object
 */
export type ModelToDocumentConverter<T> = (model: T) => any

/**
 * Type of a conversion function from a firestore document data object to a FirestormModel
 */
export type DocumentToModelConverter<T> = (documentData: any) => T