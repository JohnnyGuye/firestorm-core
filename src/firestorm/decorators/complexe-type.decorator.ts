import { Type } from "@angular/core"
import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage"
import { DocumentToModelConverter, ModelToDocumentConverter } from "../core/firestorm-model"
import { FIRESTORM_METADATA_STORAGE } from "../storage"

export interface IAutoSerializerOptions {

  type: Type<any>
  
  container?: 'array'

}

export interface IExplicitSerializerOptions<T> {

  toDocument: ModelToDocumentConverter<T>
  toModel: DocumentToModelConverter<T>

}

export type IComplexeTypeOptions<T> = IAutoSerializerOptions | IExplicitSerializerOptions<T>


export function ComplexeType<T>(options: IComplexeTypeOptions<T>) {

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