import { FirestormModel } from "../core/firestorm-model"
import { Type } from "../core/helpers"

export type IParentCollectionOption<T extends FirestormModel> = 
{
  type: Type<T>
  instance: T
  key: string  
} | {
  type: Type<T>
  id: string,
  key: string
} | {
  type: Type<T>
  instanceOrId: T | string,
  key: string
}