import { Type } from "../core/type";

/**
 * Error to throw when attempting to retrieve metadatas for a type
 * that isn't registered
 * 
 * @template T Type without metadatas
 */
export class NotFoundMetadataError<T> extends Error {
  
  /**
   * Creates a {@link NotFoundMetadataError}
   * @param type The type without metadas
   */
  constructor(public readonly  type: Type<T>) {
    super(`The metadatas for the type ${type} do not exist.`)
  }
}