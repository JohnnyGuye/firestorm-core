import { AlreadyExistingMetadatasError, NotFoundMetadataError } from "../errors";
import { FirestormMetadata } from "./model-metadata";
import { Type } from "./type";

/**
 * Class containing all the metadatas stored in firestorm
 */
export class FirestormMetadataStore {

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly typeMetadatas = new Map<Type<any>, FirestormMetadata<any>>

  /**
   * Checks if a specific type as metadatas associated
   * @param type Type to check the existency of metadatas on
   * @returns True if it has metadatas, false otherwise
   */
  public hasMetadatas<T>(type: Type<T>) {
    if (!this.typeMetadatas) return false
    return this.typeMetadatas.has(type)
  }

  /**
   * Gets the metadatas of a type
   * @throws NotFoundMetadataError if there are not metadatas for this type
   * @param type Type to retrieves the metadas from
   * @returns 
   */
  public getMetadatas<T>(type: Type<T>) {
    const md = this.tryGetMetadatas(type)
    if (!md) throw new NotFoundMetadataError(type)
    return md
  }

  /**
   * Gets the list of all the types that have been registered
   */
  public get registeredTypes() {
    return [...this.typeMetadatas.keys()]
  }

  
  /**
   * Create if needed and then returns the metadatas of a type
   * @template T The static type of the type to register
   * @param type Type to retrieve
   * @returns The metadatas of the type.
   */
  public getOrCreateMetadatas<T>(type: Type<T>) {
    return this.tryGetMetadatas(type) || this.createMetadatas(type)
  }

  /**
   * Create metadatas for a type.
   * If it already exists, it will throw.
   * @template T The static type of the type to register
   * @param type Type for which to create the medatas
   * @returns 
   */
  private createMetadatas<T>(type: Type<T>) {

    const md = this.tryCreateMetadatas(type) 
    if (!md) throw new AlreadyExistingMetadatasError(type)

    return md
  }

  /**
   * Tries to create the metadatas for a type
   * 
   * If the type already exists, it won't recreate it.
   * @template T The static type of the type to register
   * @param type The type to register
   * @returns The metadatas of the new registered type or null if already registered
   */
  private tryCreateMetadatas<T>(type: Type<T>) {
    if (this.hasMetadatas(type)) return null

    const metadata: FirestormMetadata<T> = new FirestormMetadata(type)
    
    // Extract the properties
    const instantiatedObject: T = new type
    for (const key of Object.getOwnPropertyNames(instantiatedObject)) {
      metadata.addProperty(key)
    }

    this.typeMetadatas.set(type, metadata)

    return metadata
  }

  /**
   * Tries to retrieve the metadatas for a type.
   * 
   * @param type Type for which you want the metadatas
   * @returns The metadatas for this type or null if no metadatas.
   */
  private tryGetMetadatas<T>(type: Type<T>) {

    if (!this.typeMetadatas) return null
    
    const md = this.typeMetadatas.get(type)
    if (!md) return null

    return md as FirestormMetadata<T>
  }

}