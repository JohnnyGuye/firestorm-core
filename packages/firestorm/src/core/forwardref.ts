import { Type } from "./type";

/**
 * Used to delay when a type is retrieved, mostly to solve cyclic dependencies
 * @template T Compile time type of the type returned
 */
export type ForwardRef<T> = () => Type<T>

/**
 * Action performed on a type
 * @template T Compile time type of the type the action is applied on
 * @param type Type of this action is applied on
 */
export type ForwardRefAction<T> = (type: Type<T>) => void