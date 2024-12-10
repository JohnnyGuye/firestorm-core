import { FirestoreDocument } from "./firestore-document"
import { DocumentToModelFieldConverter, FirestormModel, ModelToDocumentFieldConverter } from "./firestorm-model"
import { isIn, Type } from "./type"
import { PropertyMetadatas } from "./property-metadatas"
import { PropertyBluePrint } from "./property-blueprint"




interface SubCollectionMetadas {
  propertyName: string
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

  private _propertyMetadatas = new Map<string, PropertyMetadatas>()  

  private getOrCreatePropertyMetadata(propertyName: string) {
    let propertyMetadatas = this._propertyMetadatas.get(propertyName)
    if (!propertyMetadatas) {
      propertyMetadatas = new PropertyMetadatas(propertyName)
      this._propertyMetadatas.set(propertyName, propertyMetadatas)
    }
    return propertyMetadatas
  }

  /**
   * Marks a key in the model to be read when deserializing a document
   * @param propertyName They name of the property in the model
   * @returns The default key that will be used in the document
   */
  public addProperty(propertyName: string): string {
    return this.getOrCreatePropertyMetadata(propertyName).defaultDocumentFieldName
  }

  /**
   * Overrides the key in a document mapping to a the key in the model
   * @param propertyName Key in the model
   * @param mapTo Matching key in the document
   */
  public addPropertyRemapping(propertyName: string, mapTo: string): void {
    this.getOrCreatePropertyMetadata(propertyName).mappedTo = mapTo
  }

  /**
   * Marks a key as ignored when deserializing a document
   * @param propertyName The name of the property to ignore
   */
  public addIgnoredProperty(propertyName: string): void {
    this.getOrCreatePropertyMetadata(propertyName).ignored = true
  }

  /**
   * Marks a field as being a subcollection
   * @param propertyName The name of the property of the subcollection
   */
  public addSubCollection<T>(propertyName: string, type: Type<T>): void {
    this.getOrCreatePropertyMetadata(propertyName).subCollection = { type: type }
  }


  public addToOneRelationship<T_target_model extends FirestormModel>(
    propertyName: string, 
    targetType: Type<T_target_model>
  ) {
    this.getOrCreatePropertyMetadata(propertyName).toOne = targetType
  }

  /**
   * Adds a converter for a property from the model to the document
   * @param propertyName The name of the property in the model
   * @param converter Conversion function
   */
  public addModelToDocumentConverter<T>(propertyName: string, converter: ModelToDocumentFieldConverter<T>): void {
    const md = this.getOrCreatePropertyMetadata(propertyName)
    md.toDocumentConverter = converter
  }

  /**
   * Adds a converter for a field from the document to the model
   * @param propertyName The name of the property in the model
   * @param converter Conversion function
   */
  public addDocumentToModelConverter<T>(propertyName: string, converter: DocumentToModelFieldConverter<T>): void {
    const md = this.getOrCreatePropertyMetadata(propertyName)
    md.toModelConverter = converter
  }

  /**
   * Converts a document to a model
   * @param document Document to convert
   * @returns The model created from the document
   */
  public convertDocumentToModel(document: FirestoreDocument): T_model {

    if (!this._propertyMetadatas.size) {
      throw new Error("This model has no property metadatas. Did you forget a class decorator?")
    }
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const model: any = new this.type

    for (const md of this._propertyMetadatas.values()) {

      if (md.ignored) continue

      const propertyName = md.name

      if (!isIn(model, propertyName)) continue

      model[propertyName] = md.toModelConverter(document[md.documentFieldName])
    }

    return model
  }

  /**
   * Converts a model or part of a model to a document.
   * @param model Model to convert
   * @returns The document created from the model
   */
  public convertModelToDocument(model: Partial<T_model>): FirestoreDocument {

    if (!this._propertyMetadatas.size) {
      throw new Error("This model has no property metadatas. Did you forget a class decorator?")
    }

    const document: FirestoreDocument = {}

    for (const md of this._propertyMetadatas.values()) {

      if (md.ignored) continue

      const propertyName = md.name
      if (!isIn(model, propertyName)) continue

      const documentFieldName = md.documentFieldName

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      document[documentFieldName] = md.toDocumentConverter((model as any)[propertyName])
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
    
    for (const md of this.modelProperties) {

      const kbp: PropertyBluePrint = {
        modelProperty: md.name,
        defaultMapping: md.defaultDocumentFieldName,
        ignored: md.ignored,
        documentField: md.documentFieldName,
        complexType: md.hasConversion
      }

      bp[md.name] = kbp
    }

    return bp
  }

  /**
   * List of the properties that are mapped to a document, including ignored keys.
   */
  protected get modelProperties() {
    return this._propertyMetadatas.values()
  }

}

