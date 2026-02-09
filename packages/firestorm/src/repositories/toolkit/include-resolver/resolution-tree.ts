import { FirestormModel, Path, PathLike, Type } from "../../../core"

/**
 * Node for the resolution tree
 */
export interface IResolutionNode {

    /**
     * Segment of the path directly reaching this node
     */
    readonly segment: string

    /**
     * Whether or not this node has child nodes
     */
    readonly isLeaf: boolean

    /**
     * Gets the child node accessed with the segment given.
     * @param segment Segment to reach the child node
     * @return The child node if it exists or null.
     */
    getChild(segment: string): IResolutionNode | null;

    /**
     * Gets the child node accessed with the segment given or creates it if missing.
     * @param segment Segment to reach the child node
     * @return The child node
     */
    getOrCreateChild(segment: string): IResolutionNode;

}

/**
 * Document node for the resolution tree
 */
export class ResolutionDocumentNode implements IResolutionNode {

    private _children = new Map<string, ResolutionCollectionNode>()
    
    private _model: FirestormModel | null = null

    constructor(public readonly segment: string) {}

    /** @inheritdoc */
    get isLeaf() { 
        return this._children.size == 0
    }

    /**
     * Gets the child {@link ResolutionCollectionNode} accessed with the segment given.
     * @param segment Segment to reach the child node
     * @returns The child {@link ResolutionCollectionNode} or null if it doesn't exist.
     */
    getChild(segment: string): ResolutionCollectionNode | null {
        return this._children.get(segment) || null
    }

    /**
     * Gets the child {@link ResolutionCollectionNode} accessed with the segment given. 
     * It creates it if it doesn't exist.
     * @param segment Segment to reach the child node
     * @returns The child {@link ResolutionCollectionNode}
     */
    getOrCreateChild(segment: string): ResolutionCollectionNode {
        
        let childNode = this.getChild(segment)

        if (childNode) return childNode

        childNode = new ResolutionCollectionNode(segment)
        this._children.set(segment, childNode)

        return childNode
    }

    /**
     * Sets the model corresponding to this level.
     * @param model 
     */
    set model(model: FirestormModel) {
        this._model = model
    }

    /**
     * Gets the model corresponding to this level if any
     */
    get model(): FirestormModel | null {
        return this._model
    }

    /**
     * Whether or not this level has a model
     */
    get hasModel() {
        return this._model != null
    }

}

/**
 * Collection node for the resolution tree
 */
export class ResolutionCollectionNode implements IResolutionNode {

    private _children = new Map<string, ResolutionDocumentNode>()

    constructor(public readonly segment: string) {}

    /**
     * Whether or not this collection node has all the direct children document available in the DB
     */
    isFull: boolean = false

    /** @inheritdoc */
    get isLeaf() {
        return this._children.size == 0
    }

    /**
     * Gets the child {@link ResolutionDocumentNode} accessed with the segment given.
     * @param segment Segment to reach the child node
     * @returns The child {@link ResolutionDocumentNode} or null if it doesn't exist.
     */
    getChild(segment: string): ResolutionDocumentNode | null {
        return this._children.get(segment) || null
    }

    /**
     * Gets the child {@link ResolutionDocumentNode} accessed with the segment given. 
     * It creates it if it doesn't exist.
     * @param segment Segment to reach the child node
     * @returns The child {@link ResolutionDocumentNode}
     */
    getOrCreateChild(segment: string): ResolutionDocumentNode {

        let childNode = this._children.get(segment)

        if (childNode) return childNode

        childNode = new ResolutionDocumentNode(segment)
        this._children.set(segment, childNode)

        return childNode
    }

    get models() {
        return [...this._children.values()].map(n => n.model).filter(Boolean) as FirestormModel[]
    }

}

/**
 * Resolution tree
 */
export class ResolutionTree {

    private _rootNode = new ResolutionDocumentNode("")

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
     * @param pathLike Path to the document
     * @returns The document if it exists AND is of the type provided or null if it doesn't
     */
    getTypeDocument<T extends FirestormModel>(pathLike: PathLike, type: Type<T>): T | null {
        
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
     * @returns Gets all the document of the collection or null if the collection isn't full and {@link ignoreFullness} is not raised.
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
     * Gets or create the node at the given path
     * @param path 
     * @returns 
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
     * @param path 
     * @returns 
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