import { FirestormModel } from "../firestorm-model"
import { CollectionDocumentTuples } from "../collection-document"
import { Type } from "../type"


/**
 * Where to find the referenced document
 * - 'sibling': looks for the collection next to the collection related to this
 * - 'root:' looks for the collection starting from the root
 * - IParentCollectionOptions[]: creates the path to the parent collection
 */
export type RelationshipLocation = 'root' | 'sibling' | CollectionDocumentTuples

/**
 * Kind of relationship
 */
export type RelationshipKind = 'to-one' | 'to-many' | 'sub'

/**
 * Relationship metadata
 */
export interface RelationshipMetadata<T_model extends FirestormModel> {

  /**
   * Target type of the relationship
   */
  targetType: Type<T_model>

  /**
   * The kind of relationship
   */
  kind: RelationshipKind

}

/**
 * To-one relationship metadatas
 */
export interface ToOneRelationshipMetadata<T extends FirestormModel> extends RelationshipMetadata<T> {

  kind: 'to-one'

  location: RelationshipLocation

}

/**
 * To-many relationship metadatas
 */
export interface ToManyRelationshipMetadata<T extends FirestormModel> extends RelationshipMetadata<T> {

  kind: 'to-many'

  location: RelationshipLocation

}

export function isToOneRelationshipMetadata<T extends FirestormModel>(md?: RelationshipMetadata<T>): md is ToOneRelationshipMetadata<T> {
  if (!md) return false
  if (md.kind !== 'to-one') return false

  return true
}

export function isToManyRelationshipMetadata<T extends FirestormModel>(md?: RelationshipMetadata<T>): md is ToManyRelationshipMetadata<T> {
  if (!md) return false
  if (md.kind !== 'to-many') return false

  return true
}