import { AlreadyExistingMetadatasError, NotFoundMetadataError } from "../errors";
import { FirestormMetadata } from "./firestorm-metadata";

export class FirestormMetadataStorage {

  private _typeMetadatas?: Map<any, FirestormMetadata<any>>

  constructor() {}

  private get typeMetadatas() {
    if (!this._typeMetadatas)  this._typeMetadatas = new Map<any, FirestormMetadata<any>>()
    return this._typeMetadatas
  }

  /**
   * Checks if a specific type as metadatas associated
   * @param type Type to check the existency of metadatas on
   * @returns True if it has metadatas, false otherwise
   */
  public hasMetadatas(type: any) {
    if (!this._typeMetadatas) return false
    return this.typeMetadatas.has(type)
  }

  /**
   * Create metadatas for a type.
   * If it already exists, it will throw.
   * @deprecated Use @see createOrGetMetadatas()
   * @param type Type for which to create the medatas
   * @returns 
   */
  public createMetadatas(type: any) {

    let md = this.tryCreateMetadatas(type) 
    if (!md) throw new AlreadyExistingMetadatasError(type)

    return md
  }

  public getMetadatas(type: any) {
    const md = this.tryGetMetadatas(type)
    if (!md) throw new NotFoundMetadataError(type)
    return md
  }

  public get registeredTypes() {
    return [...this.typeMetadatas.keys()]
  }

  
  /**
   * Create if needed and then returns the metadatas of a type
   * @param type 
   * @returns 
   */
  public createOrGetMetadatas(type: any) {
    return this.tryGetMetadatas(type) || this.createMetadatas(type)
  }

  private tryCreateMetadatas(type: any) {
    if (this.hasMetadatas(type)) return null

    let metadata = new FirestormMetadata(type)
    
    // Extract the properties
    const instantiatedObject = new type
    for (let key of Object.getOwnPropertyNames(instantiatedObject)) {
      metadata.addKey(key)
    }

    this.typeMetadatas.set(type, metadata)

    return metadata
  }

  private tryGetMetadatas(type: any) {
    if (!this._typeMetadatas) return null
    let md = this.typeMetadatas.get(type)

    if (!md) return null
    return md
  }

}