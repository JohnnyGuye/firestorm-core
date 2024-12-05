import { Type } from "../core/helpers";

/**
 * Error to throw when attempting to retrieve metadatas for a type
 * that isn't registered
 */
export class NotFoundMetadataError<T> extends Error {
  
  constructor(public readonly  type: Type<T>) {
    super(`The metadatas for the type ${type} do not exist.`)
  }
}