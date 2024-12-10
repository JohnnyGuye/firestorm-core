import { FirestoreDocumentField } from "./firestore-document"
import { DocumentToModelFieldConverter, ModelToDocumentFieldConverter } from "./firestorm-model"
import { logWarn } from "./logging"
import { pascalToSnakeCase } from "./string-manipulation"
import { Type } from "./type"

interface SubCollectionMetadatas<T> {
  type: Type<T>
}

export class PropertyMetadatas<T = any> {

  private _toDocConverter?: ModelToDocumentFieldConverter<T>
  private _toModelConverter?: DocumentToModelFieldConverter<T>

  constructor(public readonly name: string) {}

  get defaultDocumentFieldName() {
    return pascalToSnakeCase(this.name)
  }

  /** When true, the property is ignored when mapping documents */
  ignored: boolean = false

  /** Overrides the default field name of the document */
  mappedTo?: string

  /** Field in the document mapped to this property */
  get documentFieldName() {
    if (this.mappedTo) return this.mappedTo
    return this.defaultDocumentFieldName
  }

  toOne?: Type<any>

  subCollection?: SubCollectionMetadatas<T>

  set toDocumentConverter(value: ModelToDocumentFieldConverter<T>) {
    if (this._toDocConverter) {
      logWarn(`There is already a doc to model conversion for the ${this.name}. The new conversion will replace it.`)
    }
    this._toDocConverter = value
  }

  get toDocumentConverter() { return this._toDocConverter || ((value: T) => value as FirestoreDocumentField)}
  

  set toModelConverter(value: DocumentToModelFieldConverter<T>) {
    if (this._toModelConverter) {
      logWarn(`There is already a doc to model conversion for the ${this.name}. The new conversion will replace it.`)
    }
    this._toModelConverter = value
  }

  get toModelConverter() { return this._toModelConverter || ((value: FirestoreDocumentField) => value as T)}

  
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
