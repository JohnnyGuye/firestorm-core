import { Type } from "../core/type"
import { FirestormMetadataStore } from "../core/firestorm-metadata-store"
import { DocumentToModelConverter, FirestormModel, ModelToDocumentConverter } from "../core/firestorm-model"
import { FIRESTORM_METADATA_STORAGE } from "../metadata-storage"
import { FirestoreDocument } from "../core/firestore-document"
import { logError } from "../core/logging"

export type ContainerOption = 'array'

/**
 * Interface stipulating the container if any for complexe type decorator
 */
interface IContainerOptions {

  /** The container in which the model is. Only supports array so far */
  container?: ContainerOption

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

function wrapInContainer<T>(documentToModelConverter: (item: FirestoreDocument) => T,  options: IComplexeTypeOptions<T>): DocumentToModelConverter<T>;
function wrapInContainer<T>(modelToDocumentConverter: (item: T) => FirestoreDocument,  options: IComplexeTypeOptions<T>): ModelToDocumentConverter<T>;
function wrapInContainer<T>(
  modelOrDocumentConverter: (item: FirestoreDocument | T) => FirestoreDocument | T, 
  options: IComplexeTypeOptions<T>
) {

  switch (options.container) {
    case 'array':
      return (modelOrDocumentAsArray: Array<T>) => {
        if (!modelOrDocumentAsArray) return []
        return modelOrDocumentAsArray.map(modelOrDocumentConverter)
      }
    default:
      return modelOrDocumentConverter
  }

}

/**
 * Decorator for complex types.
 * 
 * A complex type is pretty much any type that returns "object" when passed to "typeof".
 * @template T The type of object to parse
 * @template M The firestorm model that holds the the complex type to parse.
 * @template K The name of the property on which the model is attached
 * @param options Options of the complex type
 * @returns 
 */
export function ComplexType<T, M extends FirestormModel, K extends string>(
  options: IComplexeTypeOptions<T>
  ) {

  // For the auto serializer
  if ("type" in options) {
    return (object: M, key: K) => {

      const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
      const md = storage.getOrCreateMetadatas(object.constructor as Type<M>)

      const typeMd = storage.getOrCreateMetadatas(options.type)

      const docToMod = (document:FirestoreDocument) => typeMd.convertDocumentToModel(document)
      const modToDoc = (model: Partial<T>) => typeMd.convertModelToDocument(model)

      md.addDocumentToModelConverter(key, wrapInContainer(docToMod, options))
      md.addModelToDocumentConverter(key, wrapInContainer(modToDoc, options))

    }
  }

  // For the explicit serializer
  if ("toDocument" in options && "toModel" in options) {
    return (object: M, key: K) => {
      
      const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
      const md = storage.getOrCreateMetadatas(object.constructor as Type<M>)

      const docToMod = (document: FirestoreDocument) => options.toModel(document)
      const modToDoc = (model: T) => options.toDocument(model)

      md.addDocumentToModelConverter(key, wrapInContainer(docToMod, options))
      md.addModelToDocumentConverter(key, wrapInContainer(modToDoc, options))

    }
  }

  return () => {
    logError("Impossible options", options)
    throw new Error("You gave a set of options that isn't supported yet.")
  }
}