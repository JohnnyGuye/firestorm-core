import { IFirestormModel, Type } from "../../core"

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
 * Parent collection options
 */
export type IParentCollectionOptions<T extends IFirestormModel = IFirestormModel> 
  = {
      /** Type of the parent document */
      type: Type<T>
      /** An instance of the parent document */
      instance: T
      /** Some kind of league of legends? */
      key: string  
    } 
  | {
      /** Type of the parent document */
      type: Type<T>
      /** Id of the parent document */
      id: string,
      /** Some kind of league of legends? */
      key: string
    } 
  | {
      /** Type of the parent document */
      type: Type<T>
      /** An instance of the parent document or its id */
      instanceOrId: T | string,
      /** Some kind of league of legends? */
      key: string
    }