import { FirestoreDocument } from "./firestore-document"
import { DocumentToModelConverter, ModelToDocumentConverter } from "./firestorm-model"
import { Type } from "./type"
import { logWarn } from "./logging"
import { pascalToSnakeCase } from "./string-manipulation"

interface SubCollectionMetadas {
  key: string
}

/**
 * Metadatas linked to a type that holds information:
 * - on how to convert it to and from firestore.
 * - the fields remapped
 * - the conversions of complex fields
 * - the subcollections
 * - the fields ignored
 * @template T_model Type this metadatas are for
 */
export class FirestormMetadata<T_model> {
    
  /**
   * Creates a {@link FirestormMetadata}
   * @param type Type this metadatas are for
   */
  constructor(public readonly type: Type<T_model>) {}
  
  /**
   * Collection's path
   */
  collection?: string

  private _keys?: Map<string, string>
  
  private _mapTo?: Map<string, string>

  private _ignore?: Set<string>

  private _acceptUndefined?: Set<string>

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _toDocumentConverters = new Map<string, ModelToDocumentConverter<any>>()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _toModelConverters = new Map<string, DocumentToModelConverter<any>>()

  private _subCollections?: Map<string, SubCollectionMetadas>

  /**
   * Marks a key in the model to be read when deserializing a document
   * @param key They name of the property in the model
   * @returns The default key that will be used in the document
   */
  public addKey(key: string): string {
    if (!this._keys) this._keys = new Map<string, string>()
    const documentKey = pascalToSnakeCase(key)
    this._keys.set(key, documentKey)
    return documentKey
  }



  /**
   * Overrides the key in a document mapping to a the key in the model
   * @param key Key in the model
   * @param mapTo Matching key in the document
   */
  public addKeyRemapping(key: string, mapTo: string): void {
    if (!this._mapTo) this._mapTo = new Map<string, string>()
    this._mapTo.set(key, mapTo)
  }

  /**
   * Marks a key as ignored when deserializing a document
   * @param key The key to ignore
   */
  public addIgnoredKey(key: string): void {
    if (!this._ignore) this._ignore = new Set<string>()
    this._ignore.add(key)
  }

  /**
   * Marks a field as being a subcollection
   * @param key The key of the subcollection
   */
  public addSubCollection(key: string): void {
    if (!this._subCollections) this._subCollections = new Map<string, SubCollectionMetadas>()
    this._subCollections.set(key, { key: key })
  }

  /**
   * Whether or not a property in the model is ignored
   * @param key The name of the property in the model
   * @returns True if this property exists in the model equivalent to the document.
   */
  public isKeyIgnored(key: string): boolean {
    if (!this._ignore) return false
    return this._ignore.has(key)
  }

  /**
   * Whether or not the field can receive undefined values
   * @param key The name of the property in the model
   * @returns 
   */
  public isAcceptingUndefined(key: string) {
    if (!this._acceptUndefined) return false
    return this._acceptUndefined.has(key)
  }

  /**
   * The mapping of the field taking the remappings into account
   * @param key The field in model
   * @returns The field in the document it is mapped to
   */
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
   * Adds a converter for a property from the model to the document
   * @param key The name of the property in the model
   * @param converter Conversion function
   */
  public addModelToDocumentConverter<T>(key: string, converter: ModelToDocumentConverter<T>): void {
    if (this._toDocumentConverters.has(key)) {
      logWarn(`There is already a model to doc conversion for the ${key} of the object ${this.type.name}. The new conversion will replace it.`)
    }
    this._toDocumentConverters.set(key, converter)
  }

  /**
   * Adds a converter for a field from the document to the model
   * @param key The name of the property in the model
   * @param converter Conversion function
   */
  public addDocumentToModelConverter<T>(key: string, converter: DocumentToModelConverter<T>): void {
    if (this._toModelConverters.has(key)) {
      logWarn(`There is already a doc to model conversion for the ${key} of the object ${this.type.name}. The new conversion will replace it.`)
    }
    this._toModelConverters.set(key, converter)
  }

  /**
   * Gets the document to model conversion function of a field.
   * @param key The name of the property in the model
   * @returns The conversion function
   */
  public getDocumentToModelConverter(key: string): DocumentToModelConverter<T_model> {
    return (this._toModelConverters && this._toModelConverters.get(key)) 
        || ((value: FirestoreDocument) => value as T_model)
  }

  /**
   * Gets the model to document conversion function of a field
   * @param key The name of the property in the model
   * @returns The conversion function
   */
  public getModelToDocumentConverter(key: string): ModelToDocumentConverter<T_model> {
    return (this._toDocumentConverters && this._toDocumentConverters.get(key)) 
        || ((value: T_model) => value as FirestoreDocument)
  }

  /**
   * Checks the existency of a document to model conversion for this property key
   * @param key The name of the property in the model
   * @returns True if a conversion exists, false otherwise.
   */
  public hasDocumentToModelConversion(key: string) {
    return this._toModelConverters && this._toModelConverters.has(key) || false
  }

  /**
   * Checks the existency of a model to document conversion for this property key
   * @param key The name of the property in the model
   * @returns True if a conversion exists, false otherwise.
   */
  public hasModelToDocumentConversion(key: string) {
    return this._toDocumentConverters && this._toDocumentConverters.has(key) || false
  }

  /**
   * Checks the existency of conversion for this property from doc to model or model to doc.
   * @param key The name of the property in the model
   * @returns True if a conversion exists in at least one direction, false if none exist.
   */
  public hasConversion(key: string) {
    return this.hasDocumentToModelConversion(key) || this.hasModelToDocumentConversion(key)
  }

  /**
   * Converts a document to a model
   * @param document Document to convert
   * @returns The model created from the document
   */
  public convertDocumentToModel(document: FirestoreDocument): T_model {

    if (!this._keys) {
      throw new Error("This model has no key assigned. Did you forget a class decorator?")
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const klassInstance: any = new this.type

    for (const [key] of this._keys) {

      if (this.isKeyIgnored(key)) continue

      if (!(key in klassInstance)) {
        console.warn("???", key, klassInstance)
        continue
      }

      const mappedTo = this.isMappedTo(key)
      if (!mappedTo) continue

      const convert = this.getDocumentToModelConverter(key)
      const val = convert(document[mappedTo])
      
      if (val === undefined && !this.isAcceptingUndefined(key)) continue

      klassInstance[key] = val

    }

    return klassInstance
  }

  /**
   * Converts a model or part of a model to a document.
   * @param object Model to convert
   * @returns The document created from the model
   */
  public convertModelToDocument(object: Partial<T_model>): FirestoreDocument {

    if (!this._keys) {
      throw new Error("This model has no key assigned. Did you forget a class decorator?")
    }

    const document: FirestoreDocument = {}

    for (const [key] of this._keys) {

      if (this.isKeyIgnored(key)) continue
      
      if (!(key in object)) continue

      const mappedTo = this.isMappedTo(key)
      if (!mappedTo) continue

      const convert = this.getModelToDocumentConverter(key)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const val = convert((object as any)[key])
      
      if (val === undefined && !this.isAcceptingUndefined(key)) continue

      document[mappedTo] = val
    }

    return document
  }

  /**
   * Creates a blueprint of the document created by the model
   * 
   * @deprecated ⚠️ Not ready
   */
  public get documentBlueprint() {

    const bp: Record<string, PropertyBluePrint> = { }
    
    for (const prop of this.modelProperties) {
      const mapping = this.isMappedTo(prop)

      if (!mapping) {
        console.warn(prop)
        continue
      }

      const kbp: PropertyBluePrint = {
        modelProperty: prop,
        defaultMapping: pascalToSnakeCase(prop),
        ignored: this.isKeyIgnored(prop),
        documentKey: mapping,
        complexType: this.hasConversion(prop)
      }
      bp[mapping] = kbp
    }

    return bp
  }

  /**
   * List of the properties that are mapped to a document, including ignored keys.
   */
  protected get modelProperties() {
    if (!this._keys) return []
    return [...this._keys.keys()]
  }

}

/**
 * Describes how a property of a model is gonna be turned in a document.
 */
export interface PropertyBluePrint {

  /**
   * The name of the property within the model
   */
  modelProperty: string
  /**
   * Whether or not this property will be ignored in the document
   */
  ignored: boolean
  /**
   * The default field name in the document
   */
  defaultMapping: string
  /**
   * The actual field name in the document
   */
  documentKey: string
  /**
   * Whether or not this property has a custom conversion
   */
  complexType: boolean

}