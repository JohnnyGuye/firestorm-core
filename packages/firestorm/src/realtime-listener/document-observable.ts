import { DocumentReference, DocumentSnapshot, onSnapshot, SnapshotListenOptions } from "firebase/firestore"
import { FirestoreDocument, IFirestormModel } from "../core"
import { Repository } from "../repositories"
import { DocumentChangeSource } from "./_common"
import { Observable } from "rxjs"

/**
 * Event emitted when a document is changed
 */
export class DocumentListenerEvent<T_model extends IFirestormModel> {

  private _document: FirestoreDocument | null

  /**
   * Creates a {@link DocumentListenerEvent}
   * @internal
   * @param snapshot Document snapshot emitted by firestore 
   * @param repository Repository used to perform conversions from documents
   */
  constructor(
    snapshot: DocumentSnapshot,
    private readonly repository: Repository<T_model>
  ) {
    this._document = snapshot.data() || null
    this.source = snapshot.metadata.fromCache ? 'local' : 'server'
  }

  /**
   * The state of the document after the change
   */
  get document() {
    return this._document
  }

  /**
   * The state of the model after the change
   */
  get model(): T_model | null {
    
    return this._document
      ? this.repository.documentToModel(this._document)
      : null

  }

  /**
   * Source of the change, either local or server
   */
  source: DocumentChangeSource

}

/**
 * Type of an observable on a document
 */
export type DocumentObservable<T_model extends IFirestormModel> = Observable<DocumentListenerEvent<T_model>>

/**
 * Creates an observable on a document
 * @param repository Repository that created the listener
 * @param documentRef Reference to the document to listen to
 * @param options Listening options
 * @returns A document observable
 */
export function createDocumentObservable<T_model extends IFirestormModel>(
  repository: Repository<T_model>, 
  documentRef: DocumentReference, 
  options: SnapshotListenOptions
): DocumentObservable<T_model> {

  const listener = new Observable<DocumentListenerEvent<T_model>>(
    function (this, subscriber) {
      onSnapshot(
        documentRef, 
        options,
        {
          next: (snapshot) => {
            const evt = new DocumentListenerEvent(snapshot, repository)
            subscriber.next(evt)
          },
          error: (err) => {
            subscriber.error(err)
          },
          complete: () => {
            subscriber.complete()
          }
        }
      )
    }
  )

  return listener
}
