import { Type } from "@angular/core"
import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { DocumentToModelConverter, ModelToDocumentConverter } from "../core/firestorm-model"
import { FIRESTORM_METADATA_STORAGE } from "../storage"

/**
 * Auto serializer set of options.
 * 
 */
export interface IAutoSerializerOptions {

  type: Type<any>
  
  container?: 'array'

}

/**
 * Explicit serialization set of options
 */
export interface IExplicitSerializerOptions<T> {

  /** The model field to firestore document conversion function */
  toDocument: ModelToDocumentConverter<T>

  /** The firestore document to model field conversion function */
  toModel: DocumentToModelConverter<T>

}

/**
 * Options for the ComplexType decorator
 */
export type IComplexeTypeOptions<T> = IAutoSerializerOptions | IExplicitSerializerOptions<T>

/**
 * Decorator for complex types.
 * A complex type is pretty much any type that returns "object" when passed to "typeof"
 * @param options Options of the complex type
 * @returns 
 */
export function ComplexType<T>(options: IComplexeTypeOptions<T>) {

  if ("toDocument" in options && "toModel" in options) {
    return (object: any, key: any) => {
      
      let storage: FirestormMetadataStorage = FIRESTORM_METADATA_STORAGE
      const md = storage.createOrGetMetadatas(object.constructor)

      md.addDocumentToModelConverter(key, options.toModel)
      md.addModelToDocumentConverter(key, options.toDocument)

    }
  }

  return (...args: any) => {
    console.warn("You gave a set of options that isn't supported yet.", options)
  }
}