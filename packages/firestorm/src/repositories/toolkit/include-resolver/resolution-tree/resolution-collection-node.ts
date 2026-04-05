import { FirestormModel } from "../../../../core"
import { IResolutionNode } from "./resolution-node.interface"

import { ResolutionDocumentNode } from "./resolution-document-node"

/**
 * Collection node for the resolution tree
 */
export class ResolutionCollectionNode implements IResolutionNode {

    private _children = new Map<string, ResolutionDocumentNode>()

    /**
     * Creates a new {@link ResolutionCollectionNode}
     * @param segment Segment of the path that leads to this node
     */
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

    /**
     * Gets all the models that are in the {@link ResolutionCollectionNode} directly below
     */
    get models() {
        return [...this._children.values()].map(n => n.model).filter(Boolean) as FirestormModel[]
    }

}
