import { Observable, Subscriber, TeardownLogic } from "rxjs";

/** 
 * Type alias for observable's first parameter 
 * @internal
 * */
export type SubscribeFunction<T> = (this: Observable<T>, subscriber: Subscriber<T>) => TeardownLogic