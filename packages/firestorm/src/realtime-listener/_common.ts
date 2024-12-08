import { FirestoreDocument, IFirestormModel } from "../core";

/** Origin of the record of the document change */
export type DocumentChangeSource = 'local' | 'server'

/** Type of the document change */
export type DocumentChangeType = 'initial' | 'added' | 'modified' | 'removed'

/**
 * Base interface for a document change
 */
export interface DocumentChange<T_model extends IFirestormModel> {
  /** Id of the document */
  id: string
  /** The document as it is in the DB or local cache */
  document: FirestoreDocument
  /** The model of the document */
  model: T_model | null
  /** The current index of the document in your query */
  index: number
  /** The previous index of the documnet in your query */
  previousIndex: number
  /** The type of change this document received */
  type: DocumentChangeType
}