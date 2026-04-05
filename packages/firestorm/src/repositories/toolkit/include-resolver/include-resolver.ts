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
    FirestormPropertyMetadataWithRelationship,
    groupBy,
    distinctWithKey,
    splitInBatches,
    OR_QUERIES_MAXIMUM_DISJONCTIONS,
    Path
} from "../../../core";
import { Firestorm } from "../../../firestorm";
import { RelationshipIncludes } from "../../common";
import { ResolutionTree } from "./resolution-tree";
import { CollectionRequest, DocumentRequest, priorityComparer, Request, RequestType } from "./requests";
import { IncludeFor } from "./include-for";
import { Query } from "../../../query";


/**
 * Gets the value of the property decorated with a {@link ToOne} decorator
 * @param model Model that holds the property 
 * @param propertyName Name of the property
 * @returns The property or null if it doesn't exists or is of an incorrect type
 */
function getToOneRelationshipProperty<T extends FirestormModel>(model: any, propertyName: string): ToOneRelationship<T> | null {
    if (hasFieldOfType(model, propertyName, ToOneRelationship)) {
        return model[propertyName] as ToOneRelationship<T>
    }
    return null
}

/**
 * Gets the value of the property decorated with a {@link ToMany} decorator
 * @param model Model that holds the property 
 * @param propertyName Name of the property
 * @returns The property or null if it doesn't exists or is of an incorrect type
 */
function getToManyRelationshipProperty<T extends FirestormModel>(p: any, propertyName: string): ToManyRelationship<T> | null {
    if (hasFieldOfType(p, propertyName, ToManyRelationship)) {
        return p[propertyName] as ToManyRelationship<T>
    }
    return null
}


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


    /**
     * Creates an {@link IncludeResolver}
     * @param firestorm FirestORM instance used to access the DB
     * @param type Type of model
     */
    constructor(protected readonly firestorm: Firestorm, type: Type<P>) {
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
     * @param includes Includes to resolve
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

        const requests = this.extractRequests(relationshipsToInclude)

        await this.resolveRequestsAsync(requests)

        this.assignDocuments(relationshipsToInclude)
    }

    private extractRequests(relationshipsToInclude: FirestormPropertyMetadataWithRelationship[]) {
        return this.includers
                .map(includer => relationshipsToInclude.map(relToInclude => this.extractRelationshipRequests(includer, relToInclude)))
                .flat(2)

    }

    /**
     * Extract the document requests for each property of a document
     * @param includer Includer from which the property is
     * @param propertyMetadata Metadatas of the property
     * @returns 
     */
    private extractRelationshipRequests(
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
    
    /**
     * Resolves all the requests to make the documents accessible from the {@link IncludeResolver.resolutionTree}
     * @param requests Requests to resolve
     */
    private async resolveRequestsAsync(requests: Request<FirestormModel>[]) {
        await IncludeResolver.resolveRequestsAsync(requests, this.firestorm, this.resolutionTree)
    }

    private assignDocuments(metadatasOfPropertiesToInclude: FirestormPropertyMetadataWithRelationship[]) {

        const tree = this.resolutionTree

        for (let includer of this.includers) {

            for (let metadatasOfPropertyToInclude of metadatasOfPropertiesToInclude) {

                this.assignDocumentOfIncluderProperty(includer, metadatasOfPropertyToInclude)

            }

        }

    }

    /**
     * Assign the documents loaded in the resolution tree to the 
     * @param includer Includer from which the property is
     * @param propertyMetadata Metadatas of the property
     * @returns 
     */
    private assignDocumentOfIncluderProperty(
        includer: IncludeFor<T_model, P>, 
        propertyMetadata: FirestormPropertyMetadataWithRelationship
    ) {

        const tree = this.resolutionTree
        
        const rel = propertyMetadata.relationship
        const relMd = this.fmStorage.getOrCreateMetadatas(rel.targetType)
        const relPath = relMd.collection || ""
        const pName = propertyMetadata.name

        if (isCollectionRelationshipMetadata(rel)) {

            const pathToCollection = Path.merge(includer.documentPath, relPath)

            const documents = tree.getAllTypedDocuments(pathToCollection.path, rel.targetType)

            ;(includer.model as any)[pName] = documents || []

        }

        if (isDocumentRelationshipMetadata(rel)) {

            const pathToDocument = Path.merge(includer.documentPath, relPath)

            const document = tree.getTypedDocument(pathToDocument.path, rel.targetType)

            ;(includer.model as any)[pName] = document

        }

        if (isToManyRelationshipMetadata(rel)) {

            const prop = getToManyRelationshipProperty(includer.model, propertyMetadata.name)
            if (!prop) return

            const documents = 
                prop.ids
                    .map(id => {
                        const pathToDocument = Path.merge(includer.documentPath, id)
                        return tree.getTypedDocument(pathToDocument, rel.targetType)
                    })

            prop.assignModels(documents)

        }
    }

    /**
     * Resolves all the request by fetching documents and putting them in the resolutionTree
     * @param requests Requests to resolve
     * @param firestorm Firestorm instance to access the DB
     * @param resolutionTree Resolution tree in which to put the documents
     */
    private static async resolveRequestsAsync(requests: Request<FirestormModel>[], firestorm: Firestorm, resolutionTree: ResolutionTree) {

        // Make the requests unique per document to avoid fetching multiple times the same document
        requests = distinctWithKey(requests, (r) => r.path)
        requests.sort(priorityComparer)

        const requestGroups = groupBy( requests, (r) => r.path.pathToDeepestCollection)
        
        for (let [colPath, requestsInGroup] of requestGroups) {
            
            const reqType = requestsInGroup[0].type
            const repo = firestorm.getCrudRepository(reqType, colPath)

            const requestByType = groupBy(requestsInGroup, (r) => r.requestType)

            // Resolve full collections first so the models may be ready for single document retrievals
            const fullCollectionRequests = requestByType.get(RequestType.FullCollection)
            if (fullCollectionRequests) {
                let documents = resolutionTree.getAllDocuments(colPath)
                if (documents == null) {
                    documents = await repo.getAllAsync()
                    resolutionTree.addAllDocumentsOfACollection(colPath, documents)
                }
            }

            // Resolve the documents one by one
            const singleDocumentRequests = requestByType.get(RequestType.Document) || []
            let unresolvedSingleDocumentRequests
                = singleDocumentRequests.filter(sdr => resolutionTree.getDocument(sdr.path) == null)
            
            for (let batch of splitInBatches(unresolvedSingleDocumentRequests.map(usdr => usdr.path.lastSegment), OR_QUERIES_MAXIMUM_DISJONCTIONS)) {

                const documents = await repo.queryAsync(new Query().where("id", "in", batch))
                resolutionTree.addDocuments(colPath, documents)

            }

        }

    }


}

