import { FIRESTORM_METADATA_STORAGE } from "../../../metadata-storage";
import { FirestormModel, isCollectionRelationshipMetadata, isDocumentRelationshipMetadata, isToManyRelationshipMetadata, isToOneRelationshipMetadata, Path, PathLike, Type } from "../../../core";
import { Firestorm } from "../../../firestorm";
import { RelationshipIncludes } from "../../common";
import { ResolutionTree } from "./resolution-tree";
import { CollectionRequest, DocumentRequest, Request } from "./requests";

export interface IncludeFor<T_model extends FirestormModel, P extends Partial<T_model>> {
    
    model: P

    path: PathLike

}

export class IncludeResolver<T_model extends FirestormModel, P extends Partial<T_model>> {

    protected targetType: Type<P>

    protected resolutionTree = new ResolutionTree()

    protected requests: Request<any>[] = []

    protected includers: IncludeFor<T_model, P>[] = []

    constructor(type: Type<P>) {
        this.targetType = type
    }

    includeFor(includeFor: IncludeFor<T_model, P>): void;
    includeFor(includeFor: IncludeFor<T_model, P>[]): void;
    includeFor(includeOrIncludesFor: IncludeFor<T_model, P> | IncludeFor<T_model, P>[]) {
        if (includeOrIncludesFor instanceof Array) {
            this.includers.push(...includeOrIncludesFor)
        } else {
            this.includers.push(includeOrIncludesFor)
        }
    }

    async resolveAsync(includes: RelationshipIncludes<T_model>) {
        
        const fmStorage = FIRESTORM_METADATA_STORAGE
        const modelMetadatas = fmStorage.getOrCreateMetadatas(this.targetType)

        const requests = this.requests

        modelMetadatas
            .relationshipMetadatas
            .filter(md => {
                return (md.name in includes) && (includes as any)[md.name]    
            })
            .map(md => {
                
                console.warn(md, md.relationship.kind)
                
                if (isCollectionRelationshipMetadata(md.relationship)) {
                    const request = new CollectionRequest(md.relationship.targetType, Path.fromString(""))
                    requests.push(request)
                }

                if (isDocumentRelationshipMetadata(md.relationship)) {
                    const request = new DocumentRequest(md.relationship.targetType, Path.fromString(""))
                    requests.push(request)
                }

                if (isToManyRelationshipMetadata(md.relationship)) { 
                    // const request = new DocumentRequest(md.relationship.targetType, Path.)
                }
                
                if (isToOneRelationshipMetadata(md.relationship)) {

                }
                

                return md
            })
    }

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