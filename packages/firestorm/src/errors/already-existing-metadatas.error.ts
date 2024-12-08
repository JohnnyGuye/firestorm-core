import { Type } from "../core/type";

/**
 * Error to throw when attempting to recreate metadatas 
 * for a type that already has metadatas
 * @template T Type with registered metadatas
 */
export class AlreadyExistingMetadatasError<T> extends Error {

  /**
   * Creates {@link AlreadyExistingMetadatasError}
   * @param type Type already registered
   */
  constructor(public readonly type: Type<T>) {
    super(`The metadatas for the type ${type} already exist`)
  }

}