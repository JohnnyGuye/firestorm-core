import { Observable, Subscriber, TeardownLogic } from "rxjs";

/** 
 * Type alias for observable's first parameter 
 * @template T Type of the notification
 * @param this The observable upon which you suscribe
 * @param subscriber The subscriber of the observable
 * */
export type SubscribeFunction<T> = (this: Observable<T>, subscriber: Subscriber<T>) => TeardownLogic