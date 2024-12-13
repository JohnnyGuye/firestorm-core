import { FirestormModel } from "./firestorm-model"
import { CollectionDocumentTuples } from "./collection-document"
import { Type } from "./type"


/**
 * Where to find the referenced document
 * - 'sibling': looks for the collection next to the collection related to this
 * - 'root:' looks for the collection starting from the root
 * - IParentCollectionOptions[]: creates the path to the parent collection
 */
export type RelationshipLocation = 'root' | 'sibling' | CollectionDocumentTuples

export type RelationshipKind = 'to-one' | 'sub'

export interface RelationshipMetadata<T extends FirestormModel> {

  targetType: Type<T>

  kind: RelationshipKind

}

export interface ToOneRelationshipMetadata<T extends FirestormModel> extends RelationshipMetadata<T> {

  kind: 'to-one'

  location: RelationshipLocation

}

export function isToOneRelationshipMetadata<T extends FirestormModel>(md?: RelationshipMetadata<T>): md is ToOneRelationshipMetadata<T> {
  if (!md) return false
  if (md.kind !== 'to-one') return false

  return true
}