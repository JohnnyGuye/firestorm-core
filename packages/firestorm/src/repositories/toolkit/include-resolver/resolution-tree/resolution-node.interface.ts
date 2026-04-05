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