export interface FirestormModel {

    id: string | null
    
}

export interface ISubcollection<T> {

}

/**
 * 
 */
export type ModelToDocumentConverter<T> = (model: T) => any
export type DocumentToModelConverter<T> = (documentData: any) => T