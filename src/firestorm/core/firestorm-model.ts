export interface FirestormModel {

    id: string | null
    
}

/**
 * 
 */
export type ModelToDocumentConverter<T> = (model: T) => any
export type DocumentToModelConverter<T> = (documentData: any) => T