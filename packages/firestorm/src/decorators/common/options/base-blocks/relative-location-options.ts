import { RelationshipLocation } from "../../../../core";

/**
 * Base interface for options requiring a relative location to a model
 */
export interface IRelativeLocationOptions {
      
    /**
     * Location of the parent document to the collection containing the targeted model
     */
    location: RelationshipLocation

}