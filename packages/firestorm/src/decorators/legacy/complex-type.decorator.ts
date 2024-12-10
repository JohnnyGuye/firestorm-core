import { Type } from "../../core/type"
import { FirestormMetadataStore } from "../../core/firestorm-metadata-store"
import { DocumentToModelFieldConverter, FirestormModel, ModelToDocumentFieldConverter } from "../../core/firestorm-model"
import { FIRESTORM_METADATA_STORAGE } from "../../metadata-storage"
import { FirestoreDocument, FirestoreDocumentField } from "../../core/firestore-document"
import { logError } from "../../core/logging"

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
  toDocument: ModelToDocumentFieldConverter<T>

  /** The firestore document to model field conversion function */
  toModel: DocumentToModelFieldConverter<T>

}

/**
 * Options for the ComplexType decorator
 */
export type IComplexeTypeOptions<T> = IAutoSerializerOptions<T> | IExplicitSerializerOptions<T>

function wrapInContainer<T>(documentToModelConverter: DocumentToModelFieldConverter<T>,  options: IComplexeTypeOptions<T>): DocumentToModelFieldConverter<T>;
function wrapInContainer<T>(modelToDocumentConverter: ModelToDocumentFieldConverter<T>,  options: IComplexeTypeOptions<T>): ModelToDocumentFieldConverter<T>;
function wrapInContainer<T>(
  converter: (item: FirestoreDocument | T) => FirestoreDocument | T, 
  options: IComplexeTypeOptions<T>
) {

  switch (options.container) {
    case 'array':
      return (modelOrDocumentAsArray: Array<T>) => {
        if (!modelOrDocumentAsArray) return []
        return modelOrDocumentAsArray.map(converter)
      }
    default:
      return converter
  }

}

/**
 * Decorator for complex types.
 * 
 * A complex type is pretty much any type that returns "object" when passed to "typeof".
 * @template T_field The type of object to parse
 * @template T_model The firestorm model that holds the the complex type to parse.
 * @template K The name of the property on which the model is attached
 * @param options Options of the complex type
 * @returns 
 */
export function ComplexType<T_field, T_model extends FirestormModel, K extends string>(
  options: IComplexeTypeOptions<T_field>
  ) {

  // For the auto serializer
  if ("type" in options) {
    return (object: T_model, propertyName: K) => {

      const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
      const md = storage.getOrCreateMetadatas(object.constructor as Type<T_model>)

      const typeMd = storage.getOrCreateMetadatas(options.type)

      const docToMod = (documentField:FirestoreDocumentField) => typeMd.convertDocumentToModel(documentField as FirestoreDocument)
      const modToDoc = (model: Partial<T_field>) => typeMd.convertModelToDocument(model) as FirestoreDocumentField

      md.addDocumentToModelConverter(propertyName, wrapInContainer(docToMod, options))
      md.addModelToDocumentConverter(propertyName, wrapInContainer(modToDoc, options))

    }
  }

  // For the explicit serializer
  if ("toDocument" in options && "toModel" in options) {
    return (object: T_model, key: K) => {
      
      const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
      const md = storage.getOrCreateMetadatas(object.constructor as Type<T_model>)

      const docToMod = (document: FirestoreDocumentField) => options.toModel(document)
      const modToDoc = (model: T_field) => options.toDocument(model) as FirestoreDocumentField

      md.addDocumentToModelConverter(key, wrapInContainer(docToMod, options))
      md.addModelToDocumentConverter(key, wrapInContainer(modToDoc, options))

    }
  }

  return () => {
    logError("Impossible options", options)
    throw new Error("You gave a set of options that isn't supported yet.")
  }
}