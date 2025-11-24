import { endAt } from "firebase/firestore"
import { QueryBuildBlock } from "./query-build-block"
import { EndAtClauseEnd, LimitClauseDirection, LimitClauseLimit } from "../params";
import { ICanPrecedeLimit, LimitBlock } from "./limit-block";

/**
 * End-at query block that gives an ending document index for the query
 * 
 * Mutually explusive with {@link StartAtBlock}
 */
export class EndAtBlock 
  extends QueryBuildBlock
  implements ICanPrecedeLimit {

  constructor(
    public readonly end: EndAtClauseEnd
  ) {
    super()
  }

  /** @inheritdoc */
  limit(limit: LimitClauseLimit, from: LimitClauseDirection = 'start') {
    return this.next = new LimitBlock(limit, from)
  }

  /** @inheritdoc */
  toConstraint() {
    return endAt(this.end)
  }

}

/**
 * Discribes a query block that can create an end-at clause as its following block
 */
export interface ICanPrecedeEndAt {
  
  /**
   * Appends an end-at clause to the query
   * @param end Index of the document in the global query from which to start
   */
  endAt(end: EndAtClauseEnd): EndAtBlock;

}