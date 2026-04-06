import { FirestormId } from "../../../../core"

/**
 * Base interface for options requiring a document id
 */
export interface IDocumentOptions {
    
    /** Unique identifier of the document */
    documentId: FirestormId

}
