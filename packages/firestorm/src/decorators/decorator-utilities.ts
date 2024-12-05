import { Type } from "../core/helpers"

export type ClassDecoratorReturn<T> = (constructor: Type<T>) => void