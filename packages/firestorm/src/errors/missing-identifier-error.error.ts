/**
 * Error to throw when a firestore model has an empty id when expected one.
 */
export class MissingIdentifierError extends Error {

  /** Creates a {@link MissingIdentifierError} */
  constructor() {
    super(`This action needs you to provide semantically valid firestore id or model with id`)
  }
}