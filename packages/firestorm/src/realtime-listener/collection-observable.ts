import { Observable } from "rxjs";
import { CollectionReference, DocumentSnapshot, onSnapshot, QuerySnapshot, SnapshotListenOptions } from "firebase/firestore";
import { Repository } from "../repositories";
import { IFirestormModel } from "../core";
import { DocumentChange } from "./_common";

/**
 * Events emitted after a collection is modified.
 */
export class CollectionListenerEvent<T_model extends IFirestormModel> {

  /**
   * Creates a {@link CollectionListenerEvent}
   * @internal
   * @param snapshot Document snapshot emitted by firestore 
   * @param previousSnapshot The last snapshot emitted
   * @param repository Repository used to perform conversions from documents
   */
  constructor(
    private readonly snapshot: QuerySnapshot, 
    private readonly previousSnapshot: QuerySnapshot | null,
    private readonly repository: Repository<T_model>
  ) {}

  /**
   * All the firestore documents
   */
  get documents() {
    return this.snapshot.docs.map(ds => ds.data())
  }

  /**
   * All the models
   */
  get models(): T_model[] {
    return this.snapshot.docs.map((qds) => this.snapshotToModel(qds)).filter(Boolean) as T_model[]
  }

  /**
   * All the changes, document by document
   */
  get docChanges(): DocumentChange<T_model>[] {
    return this.snapshot
      .docChanges()
      .map((value) => {
        
        const data = value.doc.data()
        const id = value.doc.id

        return {
          id: id,
          document: data,
          model: this.snapshotToModel(value.doc),
          index: value.newIndex,
          previousIndex: value.oldIndex,
          type: this.isInitial ? 'initial' : value.type
        }
      })
  }

  /**
   * Converts a document snapshot to a model
   * @param snapshot 
   * @returns 
   */
  private snapshotToModel(snapshot: DocumentSnapshot): T_model | null {
    
    const id =  snapshot.id
    const data = snapshot.data()

    if (!data) {
      return null
    }

    const model = this.repository.documentToModel(data)
    model.id = id

    return model
  }

  /**
   * True if the collection is empty
   */
  get empty() {
    return this.snapshot.empty
  }

  /**
   * The number of documents after the change
   */
  get count() {
    return this.snapshot.size
  }

  /**
   * Source of the document change
   */
  get source() {
    return this.snapshot.metadata.fromCache ? 'local' : 'server'
  }

  /**
   * True if it's the first event emitted by the listener
   */
  get isInitial() {
    return !this.previousSnapshot
  }

}

/** Type of a collection observable on T_model */
export type CollectionObservable<T_model extends IFirestormModel> = Observable<CollectionListenerEvent<T_model>>

/**
 * Createa a collection observable
 * @param repository Repository that created the listener
 * @param collectionRef Reference to the collection to listen to
 * @param options Listening options
 * @returns A collection observable
 */
export function createCollectionObservable<T_model extends IFirestormModel>(
  repository:Repository<T_model>,
  collectionRef: CollectionReference,
  options: SnapshotListenOptions
): CollectionObservable<T_model> {

  let previousSnapshot: QuerySnapshot | null = null

  const listener = new Observable<CollectionListenerEvent<T_model>>(
    function (this, subscriber) {
      onSnapshot(
        collectionRef,
        options,
        {
          next: (snapshot) => {
            if (!previousSnapshot) {
              const evt = new CollectionListenerEvent(snapshot, previousSnapshot, repository)
              subscriber.next(evt)
            } else {
              const evt = new CollectionListenerEvent(snapshot, previousSnapshot, repository)
              subscriber.next(evt)
            }
            previousSnapshot = snapshot
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

