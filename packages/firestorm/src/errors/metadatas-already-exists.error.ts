import { Type } from "../core/helpers"

/**
 * Error to throw when attempting to recreate metadatas 
 * for a type that already has metadatas
 */
export class AlreadyExistingMetadatasError<T> extends Error {

  constructor(public readonly type: Type<T>) {
    super(`The metadatas for the type ${type} already exist`)
  }

}

/**
 * Error to throw when attempting to retrieve metadatas for a type
 * that isn't registered
 */
export class NotFoundMetadataError<T> extends Error {
  
  constructor(public readonly  type: Type<T>) {
    super(`The metadatas for the type ${type} do not exist.`)
  }
}

/**
 * Error to throw when a firestore model has an empty id when expected one.
 */
export class MissingIdentifierError extends Error {

  constructor() {
    super(`This action needs you to provide semantically valid firestore id or model with id`)
  }
}