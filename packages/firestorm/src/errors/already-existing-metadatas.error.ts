import { Type } from "../core/helpers";

/**
 * Error to throw when attempting to recreate metadatas 
 * for a type that already has metadatas
 */
export class AlreadyExistingMetadatasError<T> extends Error {

  constructor(public readonly type: Type<T>) {
    super(`The metadatas for the type ${type} already exist`)
  }

}