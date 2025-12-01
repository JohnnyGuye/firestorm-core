import { ToManyRelationship, ToOneRelationship } from "../../decorators"
import { FirestormMetadata, FirestormModel, IFirestormModel, isCollectionRelationshipMetadata, isDocumentRelationshipMetadata, isIn, isToManyRelationshipMetadata, isToOneRelationshipMetadata, OR_QUERIES_MAXIMUM_DISJONCTIONS, RelationshipMetadata, splitInBatches } from "../../core"
import { Repository } from "../repository"
import { RelationshipIncludes } from "../common"
import { Query } from "../../query"
import { createCollectionCrudRepositoryInstantiator } from "../collection-crud-repository"
import { FirestormPropertyMetadataWithRelationship } from "@firestorm/src/core/property-metadatas"
import { FIRESTORM_METADATA_STORAGE } from "@firestorm/src/metadata-storage"

interface RelationshipInfos<T extends IFirestormModel, U> {

  relationship: RelationshipMetadata<T>

  propertyValue: U

  propertySetter: (value: any) => void

}

function extractRelationshipInfos<P extends Partial<FirestormModel>>(model: P) {

  return (metadata: FirestormPropertyMetadataWithRelationship): RelationshipInfos<any, any> => {

    const pName = metadata.name
    if (!isIn(model, pName)) {
      return {
        relationship: metadata.relationship, 
        propertyValue: undefined,
        propertySetter: (value) => {
          (model as any)[pName] = value
        }
      }
    }

    const propertyValue = (model as any)[pName]
    return {      
      relationship: metadata.relationship,
      propertyValue: propertyValue,
      propertySetter: (value) => {
        (model as any)[pName] = value
      }
    }

  }

}

export function includeResolver<T_model extends FirestormModel, P extends Partial<T_model>>(
  includes: RelationshipIncludes<T_model>,
  model: P,
  modelMetadatas: FirestormMetadata<T_model>, 
  repository: Repository<T_model>
) {

  return modelMetadatas
    .relationshipMetadatas
    .filter(md => {
      return (md.name in includes) && (includes as any)[md.name]
    })
    .map(extractRelationshipInfos(model))
    .map(async ({relationship, propertyValue, propertySetter}) => {

      console.warn(relationship, propertyValue)

      if (isCollectionRelationshipMetadata(relationship)) {

        const md = FIRESTORM_METADATA_STORAGE.getOrCreateMetadatas(relationship.targetType)
        const collection = md.collection
        if (!collection) {
          console.warn("No collection associated with this metadata ", relationship.targetType.name)
          return
        }
        const crud = repository.getRepositoryFromFunction(createCollectionCrudRepositoryInstantiator(), relationship.targetType, collection)
        const result = await crud.getAllAsync();
        
        propertySetter(result)

        return
        
      }

      if (isDocumentRelationshipMetadata(relationship)) {

        const md = FIRESTORM_METADATA_STORAGE.getOrCreateMetadatas(relationship.targetType)
        const collection = md.collection
        if (!collection) {
          console.warn("No collection associated with this metadata ", relationship.targetType.name)
          return
        }
        const crud = repository.getRepositoryFromFunction(createCollectionCrudRepositoryInstantiator(), relationship.targetType, collection)
        const result = await crud.getByIdAsync(relationship.documentId);
        
        propertySetter(result)

        return
        
      }
      
      if (!propertyValue) return
      
      if (isToOneRelationshipMetadata(relationship) && propertyValue instanceof ToOneRelationship && propertyValue.id ) {
          
          const crud = repository.getRepositoryFromFunction(createCollectionCrudRepositoryInstantiator(), propertyValue.type, relationship.location)
          const include = await crud.getByIdAsync(propertyValue.id)
          
          if (include) {
              propertyValue.setModel(include)
          }

          return
  
      }

      if (isToManyRelationshipMetadata(relationship) && propertyValue instanceof ToManyRelationship) {

        const crud = repository.getRepositoryFromFunction(createCollectionCrudRepositoryInstantiator(), propertyValue.type, relationship.location)

        const allIds = propertyValue.ids
        for (let batch of splitInBatches(allIds, OR_QUERIES_MAXIMUM_DISJONCTIONS)) {

          const include = await crud.queryAsync(new Query().where("id", "in", batch))
          if (include) {
            propertyValue.assignModels(include)
          }

        }

        return
        
      }

    })
}