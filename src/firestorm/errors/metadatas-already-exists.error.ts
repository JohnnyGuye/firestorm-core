export class AlreadyExistingMetadatasError extends Error {

  constructor(public readonly type: any) {
    super(`The metadatas for the type ${type} already exist`)
  }

}

export class NotFoundMetadataError extends Error {
  
  constructor(public readonly  type: any) {
    super(`The metadatas for the type ${type} do not exist.`)
  }
}

export class MissingIdentifierError extends Error {

  constructor() {
    super(`This action needs you to provide semantically valid firestore id or model with id`)
  }
}