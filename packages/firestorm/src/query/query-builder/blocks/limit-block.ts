import { limit, limitToLast } from "firebase/firestore"
import { LimitClauseDirection, LimitClauseLimit } from "../params"
import { QueryBuildBlock } from "./query-build-block"

/**
 * A limit query block that restricts the amount of documents retrieved by a number
 */
export class LimitBlock extends QueryBuildBlock {

  /**
   * Creates a limit query block that restricts the amount of documents retrieved by a number
   * @param limit The amount of documents retrieved at most
   * @param from If the limit is applied to the starting documents retrieved or the ending
   */
  constructor(
    public readonly limit: LimitClauseLimit,
    public readonly from: LimitClauseDirection
  ) {
    super()
  }

  /** @inheritdoc */
  toConstraint() {
    switch(this.from) {
      case 'start': return limit(this.limit)
      case 'end': return limitToLast(this.limit)
    }
  }

}

/**
 * Discribes a query block that can create a limit clause as its following block
 */
export interface ICanPrecedeLimit {

  /**
   * Appends a limit clause to the query
   * @param limit Amount of element to query at most
   * @param from Starts from the start or the end of the query
   * @returns The {@link LimitBlock} appended to the query
   */
  limit(limit: LimitClauseLimit, from: LimitClauseDirection): LimitBlock;

}
