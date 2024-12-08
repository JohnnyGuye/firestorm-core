import { Observable } from "rxjs"
import { IFirestormModel } from "../core"
import { Repository } from "../repositories"
import { CollectionReference, QuerySnapshot, SnapshotListenOptions, query as firestoreQuery, onSnapshot } from "firebase/firestore"
import { IQueryBuildBlock, Query } from "../query"
import { CollectionListenerEvent } from "./collection-observable"

/**
 * Events emitted after a collection is modified.
 */
export class QueryListenerEvent<T_model extends IFirestormModel> extends CollectionListenerEvent<T_model> {}

/** Type of a query observable on T_model */
export type QueryObservable<T_model extends IFirestormModel> = Observable<QueryListenerEvent<T_model>>


/**
 * Createa a query observable
 * @param repository Repository that created the listener
 * @param collectionRef Reference to the collection to listen to
 * @param query The query on this collection
 * @param options Listening options
 * @returns A query observable
 */
export function createQueryObservable<T_model extends IFirestormModel>(
  repository: Repository<T_model>,
  collectionRef: CollectionReference,
  query: Query | IQueryBuildBlock,
  options: SnapshotListenOptions
): QueryObservable<T_model> {

  let previousSnapshot: QuerySnapshot | null = null

  const listener = new Observable<QueryListenerEvent<T_model>>(
    function (this, subscriber) {
      onSnapshot(
        firestoreQuery(collectionRef, ...query.toConstraints()),
        options,
        {
          next: (snapshot) => {
            if (!previousSnapshot) {
              const evt = new QueryListenerEvent(snapshot, previousSnapshot, repository)
              subscriber.next(evt)
            } else {
              const evt = new QueryListenerEvent(snapshot, previousSnapshot, repository)
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