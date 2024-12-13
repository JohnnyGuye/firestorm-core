import { IParentCollectionOptions } from "../../repositories"

/**
 * Where to find the referenced document
 * - 'sibling': looks for the collection next to the collection related to this
 * - 'root:' looks for the collection starting from the root
 * - IParentCollectionOptions[]: creates the path to the parent collection
 */
export type RelationshipLocation = IParentCollectionOptions[] | 'root' | 'sibling'