import { FIRESTORM_METADATA_STORAGE } from "../../../metadata-storage";
import { 
    FirestormModel, 
    hasFieldOfType, 
    isCollectionRelationshipMetadata, 
    isDocumentRelationshipMetadata, 
    isToManyRelationshipMetadata, 
    isToOneRelationshipMetadata, 
    ToOneRelationship, 
    ToManyRelationship,
    Type, 
    FirestormMetadataStore,
    FirestormPropertyMetadataWithRelationship
} from "../../../core";
import { Firestorm } from "../../../firestorm";
import { RelationshipIncludes } from "../../common";
import { ResolutionTree } from "./resolution-tree";
import { CollectionRequest, DocumentRequest, priorityComparer, Request } from "./requests";
import { IncludeFor } from "./include-for";



/**
 * Class in charge of resolving includes in model loading.
 * Includes are subdocuments of a main document loaded alongside it
 */
export class IncludeResolver<T_model extends FirestormModel, P extends Partial<T_model>> {

    private fmStorage: FirestormMetadataStore = FIRESTORM_METADATA_STORAGE

    /**
     * Type of the document requesting includes
     */
    protected targetType: Type<P>
    
    /**
     * Main models that may request subdocuments
     */
    protected includers: IncludeFor<T_model, P>[] = []

    /**
     * Documents already loaded
     */
    protected resolutionTree = new ResolutionTree()

    /**
     * List of requests for documents
     */
    protected requests: Request<any>[] = []


    constructor(type: Type<P>) {
        this.targetType = type
    }

    /**
     * Adds one document inclusion
     * @param includeFor Document to include with its path
     */
    includeFor(includeFor: IncludeFor<T_model, P>): void;
    /**
     * Adds multiple document inclusions
     * @param includeFor Documents to include with their path
     */
    includeFor(includeFor: IncludeFor<T_model, P>[]): void;
    includeFor(includeOrIncludesFor: IncludeFor<T_model, P> | IncludeFor<T_model, P>[]) {
        if (includeOrIncludesFor instanceof Array) {
            this.includers.push(...includeOrIncludesFor)
        } else {
            this.includers.push(includeOrIncludesFor)
        }
    }

    /**
     * Resolves the includes for the includes
     * @param includes 
     */
    async resolveAsync(includes: RelationshipIncludes<T_model>) {
        

        const fmStorage = FIRESTORM_METADATA_STORAGE
        const modelMetadatas = fmStorage.getOrCreateMetadatas(this.targetType)


        const relationshipsToInclude =
            modelMetadatas
                .relationshipMetadatas
                .filter(md => {
                    return (md.name in includes) && (includes as any)[md.name]    
                })

        const requests =
            this.includers
                .map(includer => relationshipsToInclude.map(relToInclude => this.resolveRelationshipRequests(includer, relToInclude)))
                .flat(2)
                .sort(priorityComparer)
    }

    private resolveRelationshipRequests(
            includer: IncludeFor<T_model, P>, 
            propertyMetadata: FirestormPropertyMetadataWithRelationship
        ) : Request<any>[] {

        const rel = propertyMetadata.relationship
        const relMd = this.fmStorage.getOrCreateMetadatas(rel.targetType)
        const relPath = relMd.collection

        if (isCollectionRelationshipMetadata(rel)) {
            const request = new CollectionRequest(rel.targetType, includer.documentPath, relPath)
            return [request]
        }

        if (isDocumentRelationshipMetadata(rel)) {
            const request = new DocumentRequest(rel.targetType, includer.documentPath, relPath)
            return [request]
        }

        if (isToManyRelationshipMetadata(rel)) { 

            const prop = getToManyRelationshipProperty(includer.model, propertyMetadata.name)
            if (!prop) return []

            return prop.ids
                .filter(Boolean)
                .map(id => new DocumentRequest(rel.targetType, includer.documentPath, rel.location))
        }
        
        if (isToOneRelationshipMetadata(rel)) {
            
            const prop = getToOneRelationshipProperty(includer.model, propertyMetadata.name)
            if (!prop || !prop.id) return [];

            const request = new DocumentRequest(rel.targetType, includer.documentPath, rel.location)
            return [request]
        }

        return []
    }

}


function getToOneRelationshipProperty<T extends FirestormModel>(p: any, propertyName: string): ToOneRelationship<T> | null {
    if (hasFieldOfType(p, propertyName, ToOneRelationship)) {
        return p[propertyName] as ToOneRelationship<T>
    }
    return null
}

function getToManyRelationshipProperty<T extends FirestormModel>(p: any, propertyName: string): ToManyRelationship<T> | null {
    if (hasFieldOfType(p, propertyName, ToManyRelationship)) {
        return p[propertyName] as ToManyRelationship<T>
    }
    return null
}

// /**
//  * 
//  * @param type 
//  * @param model 
//  * @param pathToModel 
//  * @param includes 
//  * @param firestorm 
//  * @returns 
//  */
// function includeResolver<T_model extends FirestormModel, P extends Partial<T_model>>(
//     type: Type<P>,
//     model: P,
//     pathToModel: string,
//     includes: RelationshipIncludes<T_model>
// ) {

//     const fmStorage = FIRESTORM_METADATA_STORAGE
//     const modelMetadatas = fmStorage.getOrCreateMetadatas(type)

//     const requests: Request<any>[] = []
//     const resolutionTree = new ResolutionTree()

//     const topLevelRequests = 
//         modelMetadatas
//             .relationshipMetadatas
//             .filter(md => {
//                 return (md.name in includes) && (includes as any)[md.name]    
//             })
//             .map(md => {
                
//                 console.warn(md, md.relationship.kind)
                
//                 if (isCollectionRelationshipMetadata(md.relationship)) {
//                     const request = new CollectionRequest(md.relationship.targetType, Path.fromString(""))
//                     requests.push(request)
//                 }

//                 if (isDocumentRelationshipMetadata(md.relationship)) {
//                     const request = new DocumentRequest(md.relationship.targetType, Path.fromString(""))
//                     requests.push(request)
//                 }

//                 if (isToManyRelationshipMetadata(md.relationship)) { 
//                     // const request = new DocumentRequest(md.relationship.targetType, Path.)
//                 }
                
//                 if (isToOneRelationshipMetadata(md.relationship)) {

//                 }
                

//                 return md
//             })

//     return async () => {
//     }

// }