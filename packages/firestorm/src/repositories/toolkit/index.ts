import { ToOneRelationship } from "../../decorators"
import { FirestormMetadata, FirestormModel, isIn, isToOneRelationshipMetadata } from "../../core"
import { Repository } from "../repository"
import { RelationshipIncludes } from "../common"
import { createCollectionCrudRepositoryInstantiator } from "../collection-crud-repository"

export function includeResolver<T_model extends FirestormModel, P extends Partial<T_model>>(
  includes: RelationshipIncludes<T_model>,
  model: P, 
  modelMetadatas: FirestormMetadata<T_model>, 
  repository: Repository<T_model>
) {

  return modelMetadatas.relationshipMetadatas
    .filter(md => {
      return (md.name in includes) && (includes as any)[md.name]
    })
    .map(metadata => {
      const pName = metadata.name
      if (!isIn(model, pName)) return { relationship: metadata.relationship, propertyValue: undefined }
      const propertyValue = (model as any)[pName]
      return {
        relationship: metadata.relationship,
        propertyValue: propertyValue
      }
    })
    .map(async ({relationship, propertyValue}) => {
      
      if (!propertyValue) return
      
      if (isToOneRelationshipMetadata(relationship) && propertyValue instanceof ToOneRelationship && propertyValue.id ) {
          
          const crud = repository.getRepositoryFromFunction(createCollectionCrudRepositoryInstantiator(), propertyValue.type, relationship.location)
          const include = await crud.getByIdAsync(propertyValue.id)
          
          if (include) {
              propertyValue.setModel(include)
          }
  
      }

    })
}