import { Type } from "@angular/core"
import { DocumentToModelConverter, ModelToDocumentConverter } from "./firestorm-model"
import { pascalToSnakeCase } from "./helpers"

/**
 * Metadatas linked to a type that holds information:
 * - on how to convert it to and from firestore.
 */
export class FirestormMetadata<T> {
    
  constructor(public readonly type: Type<T>) {}
  
  collection?: string

  private _keys?: Map<string, string>
  
  private _mapTo?: Map<string, string>

  private _ignore?: Set<string>

  private _toDocumentConverters?: Map<string, ModelToDocumentConverter<any>>

  private _toModelConverters?: Map<string, DocumentToModelConverter<any>>

  private _subCollections?: Map<string, any>

  /**
   * Marks a key in the model to be read when deserializing a document
   * @param key 
   */
  public addKey(key: string) {
    if (!this._keys) this._keys = new Map<string, string>()
    let documentKey = pascalToSnakeCase(key)
    this._keys.set(key, documentKey)
  }

  /**
   * Overrides the key in a document mapping to a the key in the model
   * @param key Key in the model
   * @param mapTo Matching key in the document
   */
  public addKeyRemapping(key: string, mapTo: string) {
    if (!this._mapTo) this._mapTo = new Map<string, string>()
    this._mapTo.set(key, mapTo)
  }

  /**
   * Marks a key as ignored when deserializing a document
   * @param key 
   */
  public addIgnoredKey(key: string) {
    if (!this._ignore) this._ignore = new Set<string>()
    this._ignore.add(key)
  }

  public addSubCollection(key: string) {
    if (!this._subCollections) this._subCollections = new Map<string, any>()
    this._subCollections.set(key, {})
  }

  public isKeyIgnored(key: string): boolean {
    if (!this._ignore) return false
    return this._ignore.has(key)
  }

  public isAcceptingUndefined(key: string) {
    return false
  }

  public isMappedTo(key: string): string | null {
    if (this._mapTo) {
      const mappedTo = this._mapTo.get(key)
      if (mappedTo) return mappedTo
    }

    if (this._keys) {
      const keyedTo = this._keys.get(key)
      if (keyedTo) return keyedTo
    }
    
    return null
  }

  /**
   * 
   * @param key 
   * @param converter 
   */
  public addModelToDocumentConverter<T>(key: string, converter: ModelToDocumentConverter<T>) {
    if (!this._toDocumentConverters) this._toDocumentConverters = new Map<string, ModelToDocumentConverter<any>>
    this._toDocumentConverters.set(key, converter)
  }

  public addDocumentToModelConverter<T>(key: string, converter: DocumentToModelConverter<T>) {
    if (!this._toModelConverters) this._toModelConverters = new Map<string, DocumentToModelConverter<any>>()
    this._toModelConverters.set(key, converter)
  }

  public getDocumentToModelConverter(key: string) {
    return (this._toModelConverters && this._toModelConverters.get(key)) 
        || ((value: any) => value)
  }

  public getModelToDocumentConverter(key: string) {
    return (this._toDocumentConverters && this._toDocumentConverters.get(key)) 
        || ((value: any) => value)
  }

  public convertDocumentToModel(document: any): T | null {

    if (!document) return null

    
    if (!this._keys) {
      throw new Error("This model has no key assigned. Did you forget a class decorator?")
    }
    
    const klassInstance: any = new this.type

    for (let [key, defaultMapping] of this._keys) {

      if (this.isKeyIgnored(key)) continue

      if (!(key in klassInstance)) { 
        console.warn("???", key, klassInstance)
        continue
      }

      const mappedTo = this.isMappedTo(key)
      if (!mappedTo) continue

      const convert = this.getDocumentToModelConverter(key)
      let val = convert(document[mappedTo])
      
      if (val === undefined && !this.isAcceptingUndefined(key)) continue

      klassInstance[key] = val

    }

    return klassInstance
  }

  public convertModelToDocument(object: Partial<T>): any {

    if (!object) return null

    if (!this._keys) {
      throw new Error("This model has no key assigned. Did you forget a class decorator?")
    }

    const document: any = {}

    for (let [key, defaultMapping] of this._keys) {

      if (this.isKeyIgnored(key)) continue
      
      if (!(key in object)) continue

      const mappedTo = this.isMappedTo(key)
      if (!mappedTo) continue

      const convert = this.getModelToDocumentConverter(key)
      let val = convert((object as any)[key])
      
      if (val === undefined && !this.isAcceptingUndefined(key)) continue

      document[mappedTo] = val
    }

    return document
  }
}