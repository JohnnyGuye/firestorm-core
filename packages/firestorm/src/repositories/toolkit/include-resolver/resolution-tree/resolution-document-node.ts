import { FirestormModel } from "../../../../core"
import { IResolutionNode } from "./resolution-node.interface"

import { ResolutionCollectionNode } from "./resolution-collection-node"

/**
 * Document node for the resolution tree
 */
export class ResolutionDocumentNode implements IResolutionNode {

    private _children = new Map<string, ResolutionCollectionNode>()
    
    private _model: FirestormModel | null = null

    /**
     * Creates a new {@link ResolutionDocumentNode}
     * @param segment Segment of the path that leads to this node
     */
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
     * @param model Model to set
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
