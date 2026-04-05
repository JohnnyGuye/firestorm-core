import { FirestormModel, Path, PathLike, Type } from "../../../../core"
import { ResolutionCollectionNode } from "./resolution-collection-node"
import { ResolutionDocumentNode } from "./resolution-document-node"
import { IResolutionNode } from "./resolution-node.interface"

/**
 * Resolution tree
 */
export class ResolutionTree {

    private _rootNode = new ResolutionDocumentNode("")

    /**
     * Creates a {@link ResolutionTree}
     */
    constructor() {}

    /**
     * Adds a document to the resolution tree
     * @param path Full path to the document
     * @param model Model to add
     */
    addDocument<T extends FirestormModel>(path: PathLike, model: T) : void {

        const p = Path.fromPathLike(path)
        
        if (p.isCollection) {
            
            if (!model.id) {
                throw new Error("This document cannot be added because it doesn't have an id")
            }

            const documentNode = 
                this.getOrCreateNodeAt(p.segments)
                    .getOrCreateChild(model.id) as ResolutionDocumentNode


            documentNode.model = model
            
        } else {

            if (model.id !== p.lastSegment) {
                console.warn(`The model and path have different values: ${model.id} ${p.lastSegment}. The id used will be the one of the path`)
            }

            const documentNode =
                this.getOrCreateNodeAt(p.segments) as ResolutionDocumentNode

            documentNode.model = model

        }

    }

    /**
     * Adds multiple documents to the resolution tree
     * @param collectionPath Full path to the collection this document belongs to
     * @param models Models to add
     */
    addDocuments<T extends FirestormModel>(collectionPath: PathLike, models: T[]) : void {

        collectionPath = Path.fromPathLike(collectionPath).pathToDeepestCollection
        
        for (let model of models) {

            this.addDocument(collectionPath, model)
        }

    }

    /**
     * Adds all the documents of a collection to the resolution tree
     * @param path Full path to the collection
     * @param models Models to add
     */
    addAllDocumentsOfACollection<T extends FirestormModel>(path: PathLike, models: Iterable<T>) : void {

        const p = Path.fromPathLike(path)

        if (p.isDocument) {
            throw new Error("The path targets a document. You must target a collection.")
        }

        const collectionNode = 
            this.getOrCreateNodeAt(p.segments) as ResolutionCollectionNode

        for (let model of models) {
            
            if (!model.id) {
                console.warn(`This document cannot be added to the collection '${p.path}' because it doesn't have an id.`)
                continue
            }

            const documentNode = collectionNode.getOrCreateChild(model.id)
            documentNode.model = model

        }

        collectionNode.isFull = true
    }

    /**
     * Gets a document in the resolution tree
     * @param pathLike Path to the document
     * @returns The document if it exists or null if it doesn't
     */
    getDocument(pathLike: PathLike): FirestormModel | null {

        const p = Path.fromPathLike(pathLike)

        if (p.isCollection) {
            throw new Error(`The path '${p.path}' targets a collection`)
        }

        const node = this.getNodeAt(p.segments)
        if (!node) return null

        if (!(node instanceof ResolutionDocumentNode)) return null

        return node.model
    }

    /**
     * Gets a typed document in the resolution tree
     * @template T Type of the document
     * @param pathLike Path to the document
     * @param type Type of the document
     * @returns The document if it exists AND is of the type provided or null if it doesn't
     */
    getTypedDocument<T extends FirestormModel>(pathLike: PathLike, type: Type<T>): T | null {
        
        const d = this.getDocument(pathLike)
        if (!d) return null

        if (!(d instanceof type)) {
            console.warn(`A document is stored at ${Path.fromPathLike(pathLike).path} but under a different type.`)
            return null
        }

        return d
    }

    /**
     * Gets all documents of a collection in the resolution tree
     * @param pathLike Path to the collection
     * @param ignoreFullness If false (default), only gets the documents if the collection node has all the documents of the DB. 
     * If true, gets all the documents in the collection even if it may not be all the documents in the DB
     * @returns Gets all the document of the collection or null if the collection isn't full and ignoreFullness is not raised.
    */
   getAllDocuments(pathLike: PathLike, ignoreFullness: boolean = false): FirestormModel[] | null {
       
       const p = Path.fromPathLike(pathLike)
       
       if (p.isDocument) {
           throw new Error(`The path '${p.path}' targets a document`)
        }
        
        const node = this.getNodeAt(p.segments)
        if (!node) return null
        
        if (!(node instanceof ResolutionCollectionNode)) return null
        
        if (!node.isFull && !ignoreFullness) {
            return null
        }
        
        return node.models
    }
    
    /**
     * Gets all documents of a collection in the resolution tree with the type requested
     * @param T Type of the document
     * @param pathLike Path to the collection
     * @param type Type of the document
     * @param ignoreFullness If false (default), only gets the documents if the collection node has all the documents of the DB. 
     * If true, gets all the documents in the collection even if it may not be all the documents in the DB
     * @returns Gets all the document of the collection or null if the collection isn't full and ignoreFullness is not raised.
     */
    getAllTypedDocuments<T extends FirestormModel>(pathLike: PathLike, type: Type<T>, ignoreFullness: boolean = false): T[] | null {
        const untypedDocuments = this.getAllDocuments(pathLike, ignoreFullness)
        if (!untypedDocuments) return null

        const typedDocuments = untypedDocuments.filter((d) => d instanceof type) as T[]

        if (typedDocuments.length != untypedDocuments.length) {
            console.warn(`Some documents under ${pathLike} are registered with a different type than the one requested.`)
        }

        return typedDocuments
    }

    /**
     * Gets or create the node at the given path
     * @param path Path to the node
     * @returns The node found or created on the fly
     */
    private getOrCreateNodeAt(path: Readonly<string[]>): IResolutionNode {

        let currentNode: IResolutionNode = this._rootNode

        for (let segmentIndex = 0; segmentIndex < path.length; segmentIndex++) {
            
            const segment = path[segmentIndex]

            currentNode = currentNode.getOrCreateChild(segment)

        }

        return currentNode

    }

    /**
     * Gets the node at the given path
     * @param path Path to the node
     * @returns A node if found or null if not
     */
    private getNodeAt(path: Readonly<string[]>): IResolutionNode | null {

        let currentNode: IResolutionNode = this._rootNode

        for (let segmentIndex = 0; segmentIndex < path.length; segmentIndex++) {
            
            const segment = path[segmentIndex]

            let child = currentNode.getChild(segment)
            if (!child) return null

            currentNode = child

        }

        return currentNode

    }

}