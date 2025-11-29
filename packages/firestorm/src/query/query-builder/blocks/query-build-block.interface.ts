import { QueryConstraint } from "firebase/firestore";

/**
 * Describes the minimal requirements for a query block
 */
export interface IQueryBuildBlock {

  /**
   * A reference to the previous query block if this block is the first
   */
  readonly previous: IQueryBuildBlock | null
  /**
   * A reference to the next query block or null if this block is the last
   */
  readonly next: IQueryBuildBlock | null
  /**
   * Converts the full chain to a firebase set of query constraints
   * @returns Firebase query constraints equivalent to this query
   */
  toConstraints(): QueryConstraint[];

}

/**
 * @summary Type guard for {@link IQueryBuildBlock}
 * 
 * It works by duck typing the top level without checking the values of the properties so be mindful.
 * 
 * @param value Object to typeguard
 * @returns 
 */
export function isQueryBuildBlock(value: unknown): value is IQueryBuildBlock  {
  if (!value || typeof value !== 'object') return false
  return 'previous' in value
    && 'next' in value
    && 'toConstraints' in value
}