import { IFirestormModel } from "../core/firestorm-model"
import { Type } from "../core/helpers"

// Technically I could infer the type from the instance T. There is probably a way aswell to not use the key though it may be complicated

/*
### Should be possible if T only has one matching subcollection matching this model

interface IParentCollectionSetOne<T extends FirestormModel> {
    instance: T
}

### Should be always possible

interface IParentCollectionSetTwo<T extends FirestormModel> {
    instance: T
    key: string
}

### Should also be viable you don't need an actual instance if you give the type, you just need the id

interface IParentCollectionSetThree<T extends FirestormModel> {
    type: Type<T>
    partialInstanceOrId: FirestormModel | string
    key: string
}
*/

/**
 * 
 */
export type IParentCollectionOptions<T extends IFirestormModel = IFirestormModel> 
  = {
      type: Type<T>
      instance: T
      key: string  
    } 
  | {
      type: Type<T>
      id: string,
      key: string
    } 
  | {
      type: Type<T>
      instanceOrId: T | string,
      key: string
    }