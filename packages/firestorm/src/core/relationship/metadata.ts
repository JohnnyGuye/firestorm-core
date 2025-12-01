import { FirestormModel } from "../firestorm-model"
import { Type } from "../type"
import { PathLike } from "../path"

/**
 * Where to find the referenced document
*/
export type RelationshipLocation = PathLike

/**
 * Kind of relationship
 */
export type RelationshipKind 
  = 'to-one' 
  | 'to-many' 
  | 'document' 
  | 'collection' 

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

  /** @inheritdoc */
  kind: 'to-one'

  /**
   * Location of the relationship
   */
  location: RelationshipLocation

}

/**
 * To-many relationship metadatas
 */
export interface ToManyRelationshipMetadata<T extends FirestormModel> extends RelationshipMetadata<T> {

  /** @inheritdoc */
  kind: 'to-many'

  /**
   * Location of the relationship
   */
  location: RelationshipLocation

}

export interface ToDocumentRelationshipMetadata<T extends FirestormModel> extends RelationshipMetadata<T> {

  kind: 'document'

  documentId: string

}

export interface ToCollectionRelationshipMetadata<T extends FirestormModel> extends RelationshipMetadata<T> {
  
  kind: 'collection'

}

/**
 * Duck types metadata to check if it's a ToOneRelationshipMetadata
 * @template T Type of the model hosted by the metadata
 * @param metadata Metadata to test
 * @returns True if the metadata is a ToOneRelationshipMetadata
 */
export function isToOneRelationshipMetadata<T extends FirestormModel>(metadata?: RelationshipMetadata<T>): metadata is ToOneRelationshipMetadata<T> {
  
  if (!metadata) return false
  if (metadata.kind !== 'to-one') return false

  return true
}

/**
 * Duck types metadata to check if it's a ToManyRelationshipMetadata
 * @template T Type of the model hosted by the metadata
 * @param metadata Metadata to test
 * @returns True if the metadata is a ToManyRelationshipMetadata
 */
export function isToManyRelationshipMetadata<T extends FirestormModel>(metadata?: RelationshipMetadata<T>): metadata is ToManyRelationshipMetadata<T> {
  
  if (!metadata) return false
  if (metadata.kind !== 'to-many') return false

  return true
}

/**
 * Duck types metadata to check if it's a ToDocumentRelationshipMetadata
 * @template T Type of the model hosted by the metadata
 * @param metadata Metadata to test
 * @returns True if the metadata is a ToDocumentRelationshipMetadata
 */
export function isDocumentRelationshipMetadata<T extends FirestormModel>(metadata?: RelationshipMetadata<T>): metadata is ToDocumentRelationshipMetadata<T> {
  
  if (!metadata) return false
  if (metadata.kind !== 'document') return false

  return true
}

/**
 * Duck types metadata to check if it's a ToCollectionRelationshipMetadata
 * @template T Type of the model hosted by the metadata
 * @param metadata Metadata to test
 * @returns True if the metadata is a ToCollectionRelationshipMetadata
 */
export function isCollectionRelationshipMetadata<T extends FirestormModel>(metadata?: RelationshipMetadata<T>): metadata is ToCollectionRelationshipMetadata<T> {
  
  if (!metadata) return false
  if (metadata.kind !== 'collection') return false

  return true
}