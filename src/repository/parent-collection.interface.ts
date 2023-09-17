import { FirestormModel } from "../core/firestorm-model"
import { Type } from "../core/helpers"

export interface IParentCollection<T extends FirestormModel> {
    
  type: Type<T>
  instance: T
  key: string
  
}