import { Type } from "./type";

/**
 * Used to delay when a type is retrieved, mostly to solve cyclic dependencies
 */
export type ForwardRef<T> = () => Type<T>

/**
 * Action performed on a type
 */
export type ForwardRefAction<T> = (type: Type<T>) => void