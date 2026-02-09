// import { Firestorm } from "../../firestorm";
// import { FirestormMetadataStore, FirestormModel, OR_QUERIES_MAXIMUM_DISJONCTIONS, splitInBatches, ToCollectionRelationshipMetadata, ToDocumentRelationshipMetadata, ToManyRelationshipMetadata, ToOneRelationshipMetadata, Type } from "../../core";
// import { RelationshipIncludes } from "../common";
// import { ResolutionTree } from "./resolution-tree";
// import { FIRESTORM_METADATA_STORAGE } from "../../metadata-storage";
// import { Query } from "../../query";

// interface ResolutionDepencyTree {

// }
// interface ResolverCommonInputs {

//     metadataStorage: FirestormMetadataStore

//     firestorm: Firestorm

// }

// function resolverForCollectionRelationship<T extends FirestormModel>(
//     relationship: ToCollectionRelationshipMetadata<T>, 
//     inputs: ResolverCommonInputs
//     ) {
        
//     const md = inputs.metadataStorage.getOrCreateMetadatas(relationship.targetType)
    
//     const collection = md.collection
//     if (!collection) {
//         console.warn("No collection associated with this metadata ", relationship.targetType.name)
//         return
//     }

//     const repo = inputs.firestorm.getCrudRepository(
//         relationship.targetType,
//         "_default_invalid_path_"
//     )

//     return await repo.getAllAsync();
// }

// function resolverForDocumentRelationship<T extends FirestormModel>(
//     relationship: ToDocumentRelationshipMetadata<T>,
//     inputs: ResolverCommonInputs
//     ) {

//     const md = inputs.metadataStorage.getOrCreateMetadatas(relationship.targetType)
    
//     const collection = md.collection
//     if (!collection) {
//         console.warn("No collection associated with this metadata ", relationship.targetType.name)
//         return
//     }

//     const repo = inputs.firestorm.getSingleDocumentCrudRepository(
//         relationship.targetType,
//         relationship.documentId,
//         "_default_invalid_path_"
//     )

//     return await repo.getAsync();

// }

// function resolverForToManyRelationship<T extends FirestormModel>(
//     relationship: ToManyRelationshipMetadata<T>,
//     inputs: ResolverCommonInputs
//     ) {

//     const md = inputs.metadataStorage.getOrCreateMetadatas(relationship.targetType)

//     const repo = inputs.firestorm.getCrudRepository(
//         relationship.targetType,
//         relationship.location,
//     )

//     const allIds = ["missingIds"]
//     const documents = []
//     for (let batch of splitInBatches(allIds, OR_QUERIES_MAXIMUM_DISJONCTIONS)) {

//         const document = await repo.queryAsync(new Query().where("id", "in", batch))
//         documents.push(...document)
//     }

//     return documents
// }

// function resolverForToOneRelationship<T extends FirestormModel>(
//     relationship: ToOneRelationshipMetadata<T>,
//     inputs: ResolverCommonInputs
//     ) {

//     const md = inputs.metadataStorage.getOrCreateMetadatas(relationship.targetType)

//     const repo = inputs.firestorm.getSingleDocumentCrudRepository(
//         relationship.targetType,
//         "missingId",
//         relationship.location
//     )

//     await repo.getAsync()

// }

// function buildExtractors<T_model extends FirestormModel, P extends Partial<T_model>>(
//     type: Type<P>,
//     includes: RelationshipIncludes<T_model>
//     ) {

//     const fmStorage = FIRESTORM_METADATA_STORAGE
//     const modelMetadatas = fmStorage.getOrCreateMetadatas(type)

//     const mappableRelationshipMetadatas
//         = modelMetadatas
//             .relationshipMetadatas
//             .filter(md => {
//                 return (md.name in includes) && (includes as any)[md.name]
//             })

//     mappableRelationshipMetadatas
//         .map(md => {
//             return {
//                 name: md.
//             }
//         })
// }

// export function includeResolver<T_model extends FirestormModel, P extends Partial<T_model>>(
//     type: Type<P>,
//     model: P,
//     includes: RelationshipIncludes<T_model>,
//     firestorm: Firestorm
// ) {
//     return async () => {

//         const resolutionTree = new ResolutionTree()
//         const fmStorage = FIRESTORM_METADATA_STORAGE

//         const modelMetadatas = fmStorage.getOrCreateMetadatas(type)

//         modelMetadatas
//             .relationshipMetadatas
//             .filter(md => {
//                 return (md.name in includes) && (includes as any)[md.name]
//             })
//     }
// }