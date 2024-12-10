import { FirestoreDocumentField, FirestormMetadataStore, FirestormModel, Type } from "../../core"
import { FIRESTORM_METADATA_STORAGE } from "../../metadata-storage"

export interface ToOneOptions<T_target_model extends FirestormModel> {

  target: Type<T_target_model>

}

export class ToOneRelationship<T_target extends FirestormModel> {

  constructor(public readonly type: Type<T_target>, public id?: string) {}

  public value?: T_target

  public get valid() {
    if (!this.id) return !this.value
    return this.id === this.value?.id
  }

}

export function ToOne
  <
  T_model extends FirestormModel & Record<K, ToOneRelationship<T_target_model>>,
  T_target_model extends FirestormModel,
  K extends string
  >(
    options: ToOneOptions<T_target_model>
  ) {
  
  const targetType = options.target

  return (object: T_model, propertyName: K) => {

    const storage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE
    const md = storage.getOrCreateMetadatas(object.constructor as Type<T_model>)
    md.addToOneRelationship(propertyName, targetType)

    md.addDocumentToModelConverter(
      propertyName, 
      (field: FirestoreDocumentField): ToOneRelationship<T_target_model> => {
        return new ToOneRelationship(targetType, typeof field === 'string' ? field : undefined)
      }
    )
    md.addModelToDocumentConverter(
      propertyName,
      (model: ToOneRelationship<T_target_model>) => model.id || null
    )
  }

}
