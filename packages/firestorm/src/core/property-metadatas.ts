import { ToOneRelationship  } from "../decorators"
import { FirestoreDocumentField } from "./firestore-document"
import { DocumentToModelFieldConverter, FirestormModel, ModelToDocumentFieldConverter } from "./firestorm-model"
import { logWarn } from "./logging"
import { RelationshipLocation, RelationshipMetadata, ToOneRelationshipMetadata } from "./relationship"
import { pascalToSnakeCase } from "./string-manipulation"
import { Type } from "./type"

interface SubCollectionMetadatas<T> {
  type: Type<T>
}



export class FirestormPropertyMetadata<T_property_type = any> {

  private _relationship?: RelationshipMetadata<any>
  private _toDocConverter?: ModelToDocumentFieldConverter<T_property_type>
  private _toModelConverter?: DocumentToModelFieldConverter<T_property_type>

  constructor(public readonly name: string) {}

  /**
   * Gets the default document field matched with this property
   */
  get defaultDocumentFieldName() {
    return pascalToSnakeCase(this.name)
  }

  /** When true, the property is ignored when mapping documents */
  ignored: boolean = false

  /** Overrides the default field name of the document */
  mappedTo?: string

  /** 
   * Field in the document mapped to this property 
   * */
  get documentFieldName() {
    if (this.mappedTo) return this.mappedTo
    return this.defaultDocumentFieldName
  }

  /**
   * Gets the relationship this field covers if any
   */
  get relationship() {
    return this._relationship
  }

  private set relationship(value: RelationshipMetadata<any> | undefined) {
    if (this._relationship) {
      logWarn(`You replaced a previous ${this._relationship.kind} relationship on the field ${this.name} for a ${value?.kind}`)
    }
    this._relationship = value
  }

  /**
   * Sets this field as being a ToOne relationship
   * @param targetType 
   * @param location 
   */
  public setToOneRelationship<T_target_model extends FirestormModel>(
    targetType: Type<T_target_model>, 
    location: RelationshipLocation
  ) {

    const toOneRel: ToOneRelationshipMetadata<T_target_model> = { targetType, location, kind: 'to-one' }
    this.relationship = toOneRel

    this.toModelConverter = ((field: FirestoreDocumentField) => {
      return new ToOneRelationship(targetType, typeof field === 'string' ? field : undefined)
    }) as DocumentToModelFieldConverter<T_property_type>

    this.toDocumentConverter = ((model: ToOneRelationship<T_target_model>) => model.id || null) as ModelToDocumentFieldConverter<T_property_type>

  }

  subCollection?: SubCollectionMetadatas<T_property_type>

  set toDocumentConverter(value: ModelToDocumentFieldConverter<T_property_type>) {
    if (this._toDocConverter) {
      logWarn(`There is already a doc to model conversion for the ${this.name}. The new conversion will replace it.`)
    }
    this._toDocConverter = value
  }

  get toDocumentConverter() { return this._toDocConverter || ((value: T_property_type) => value as FirestoreDocumentField)}
  

  set toModelConverter(value: DocumentToModelFieldConverter<T_property_type>) {
    if (this._toModelConverter) {
      logWarn(`There is already a doc to model conversion for the ${this.name}. The new conversion will replace it.`)
    }
    this._toModelConverter = value
  }

  get toModelConverter() { return this._toModelConverter || ((value: FirestoreDocumentField) => value as T_property_type)}

  
  /**
   * Checks the existency of a model to document conversion for this property key
   * @param key The name of the property in the model
   * @returns True if a conversion exists, false otherwise.
   */
 get hasConversionToDocument() {
   return !!this._toDocConverter
  }

  /**
   * Checks the existency of a document to model conversion for this property
   * @param key The name of the property in the model
   * @returns True if a conversion exists, false otherwise.
   */
  get hasConversionToModel() {
    return !!this._toModelConverter
  }

  get hasConversion() {
    return this.hasConversionToDocument || this.hasConversionToModel
  }

}

export type FirestormPropertyMetadataWithRelationship<T_property_type = any, T_relationship extends FirestormModel = any>
  = FirestormPropertyMetadata<T_property_type> & Record<'relationship', RelationshipMetadata<T_relationship>>