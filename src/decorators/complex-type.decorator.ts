import { Type } from "../core/helpers"
import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { DocumentToModelConverter, FirestormModel, ModelToDocumentConverter } from "../core/firestorm-model"
import { FIRESTORM_METADATA_STORAGE } from "../metadata-storage"

/**
 * Interface stipulating the container if any for complexe type decorator
 */
interface IContainerOptions {

  /** The container in which the model is. Only supports array so far */
  container?: 'array'

}

/**
 * Auto serializer set of options.
 * 
 * You provide a type that may have fields decorators aswell and it will handle its serialization
 * the same way a model decoratored with Collection does.
 * 
 */
export interface IAutoSerializerOptions<T> extends IContainerOptions {

  /** Type to serialize/deserialize */
  type: Type<T>

}

/**
 * Explicit serialization set of options
 */
export interface IExplicitSerializerOptions<T> extends IContainerOptions {

  /** The model field to firestore document conversion function */
  toDocument: ModelToDocumentConverter<T>

  /** The firestore document to model field conversion function */
  toModel: DocumentToModelConverter<T>

}

/**
 * Options for the ComplexType decorator
 */
export type IComplexeTypeOptions<T> = IAutoSerializerOptions<T> | IExplicitSerializerOptions<T>

/**
 * Decorator for complex types.
 * 
 * A complex type is pretty much any type that returns "object" when passed to "typeof".
 * 
 * @param options Options of the complex type
 * @returns 
 */
export function ComplexType<T, M extends FirestormModel, K extends string>(
  options: IComplexeTypeOptions<T>
  ) {

  const wrapInContainer = (modelOrDocumentConverter: (item: any) => any) => {
    switch (options.container) {
      case 'array':
        return (modelOrDocumentAsArray: Array<any>) => {
          if (!modelOrDocumentAsArray) return []
          return modelOrDocumentAsArray.map(modelOrDocumentConverter)
        }
      default:
        return modelOrDocumentConverter
    }
  }


  if ("type" in options) {
    return (object: M, key: K) => {

      let storage: FirestormMetadataStorage = FIRESTORM_METADATA_STORAGE
      const md = storage.createOrGetMetadatas(object.constructor)

      const typeMd = storage.createOrGetMetadatas(options.type)

      const docToMod = (document:any) => typeMd.convertDocumentToModel(document)
      const modToDoc = (model: any) => typeMd.convertModelToDocument(model)

      md.addDocumentToModelConverter(key, wrapInContainer(docToMod))
      md.addModelToDocumentConverter(key, wrapInContainer(modToDoc))

    }
  }

  if ("toDocument" in options && "toModel" in options) {
    return (object: M, key: K) => {
      
      let storage: FirestormMetadataStorage = FIRESTORM_METADATA_STORAGE
      const md = storage.createOrGetMetadatas(object.constructor)

      const docToMod = (document:any) => options.toModel(document)
      const modToDoc = (model: any) => options.toDocument(model)

      md.addDocumentToModelConverter(key, wrapInContainer(docToMod))
      md.addModelToDocumentConverter(key, wrapInContainer(modToDoc))

    }
  }

  return (...args: any) => {
    console.warn("You gave a set of options that isn't supported yet.", options)
  }
}