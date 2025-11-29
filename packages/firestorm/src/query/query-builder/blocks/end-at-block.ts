import { endAt, endBefore } from "firebase/firestore"
import { QueryBuildBlock } from "./query-build-block"
import { EndAtClauseEnd, LimitClauseDirection, LimitClauseLimit } from "../params";
import { ICanPrecedeLimit, LimitBlock } from "./limit-block";

/**
 * End-at query block that gives an ending document index for the query
 * 
 * Mutually exclusive with {@link StartAtBlock}
 */
export class EndAtBlock 
  extends QueryBuildBlock
  implements ICanPrecedeLimit {

  /**
   * End-at query block that gives an ending document index for the query
   * 
   * @param end Index of the last document in the query (1-indexed)
   * @param included If true, the last document is in the result set, if false, it ends before this index
   */
  constructor(
    public readonly end: EndAtClauseEnd,
    public readonly included: boolean = true
  ) {
    super()
  }

  /** @inheritdoc */
  limit(limit: LimitClauseLimit, from: LimitClauseDirection = 'start') {
    return this.next = new LimitBlock(limit, from)
  }

  /** @inheritdoc */
  toConstraint() {
    return this.included ? endAt(this.end) : endBefore(this.end)
  }

}

/**
 * Describes a query block that can create an end-at clause as its following block
 */
export interface ICanPrecedeEndAt {
  
  /**
   * Appends an end-at clause to the query
   * @param end Index of the document in the global query from which to start
   */
  endAt(end: EndAtClauseEnd): EndAtBlock;

}