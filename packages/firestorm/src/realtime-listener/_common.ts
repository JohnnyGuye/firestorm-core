import { Observable, Subscriber, TeardownLogic } from "rxjs";


export type SubscribeFunction<T> = (this: Observable<T>, subscriber: Subscriber<T>) => TeardownLogic

export type DocumentChangeSource = 'local' | 'server'

export type DocChangeType = 'initial' | 'added' | 'modified' | 'removed'

export interface DocChange {
  type: DocChangeType
}