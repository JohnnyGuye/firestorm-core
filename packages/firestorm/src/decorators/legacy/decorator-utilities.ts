import { Type } from "../../core/type"

export type ClassDecoratorReturn<T> = (constructor: Type<T>) => void