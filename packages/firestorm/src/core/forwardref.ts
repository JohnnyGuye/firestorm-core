import { Type } from "./type";

export type ForwardRef<T> = () => Type<T>

export type ForwardRefAction<T> = (type: Type<T>) => void