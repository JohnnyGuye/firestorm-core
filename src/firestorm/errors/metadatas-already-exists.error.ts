export class AlreadyExistingMetadatasError extends Error {

  constructor(public readonly type: any) {
    super(`The metadatas for the type ${type} already exist`)
  }

}

export class NoFoundMetadataError extends Error {
  
  constructor(public readonly  type: any) {
    super(`The metadatas for the type ${type} do not exist.`)
  }
}