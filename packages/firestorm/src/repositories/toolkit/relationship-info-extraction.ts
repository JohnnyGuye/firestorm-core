import { FirestormModel, FirestormPropertyMetadataWithRelationship, isIn, RelationshipMetadata } from "../../core"

/**
 * Relationship informations
 */
export interface RelationshipInfos<T extends FirestormModel, U> {

    /**
     * The metadatas of the relationship
     */
    relationship: RelationshipMetadata<T>

    /**
     * The current value of the property
     */
    propertyValue: U

    /**
     * A setter for the property
     * @param value The value to set
     * @returns 
     */
    propertySetter: (value: any) => void

}

export function extractRelationshipInfos<P extends Partial<FirestormModel>>(model: P) {

  return (metadata: FirestormPropertyMetadataWithRelationship): RelationshipInfos<any, any> => {

    const pName = metadata.name

    const propertySetter = (value: any) => {
        (model as any)[pName] = value
    }

    
    if (!isIn(model, pName)) { 
      return {
        relationship: metadata.relationship, 
        propertyValue: undefined,
        propertySetter: propertySetter
      }
    }

    const propertyValue = (model as any)[pName]
    return {      
      relationship: metadata.relationship,
      propertyValue: propertyValue,
      propertySetter: propertySetter
    }

  }

}

