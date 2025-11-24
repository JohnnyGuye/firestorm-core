import { startAt } from "firebase/firestore"
import { QueryBuildBlock } from "./query-build-block"
import { LimitClauseDirection, LimitClauseLimit, StartAtClauseStart } from "../params";
import { ICanPrecedeLimit, LimitBlock } from "./limit-block";

/**
 * Start-at query block that gives a starting document index for the query
 * 
 * Mutually explusive with {@link EndAtBlock}
 */
export class StartAtBlock 
  extends QueryBuildBlock
  implements ICanPrecedeLimit {

  constructor(
    public readonly start: StartAtClauseStart
  ) {
    super()
  }

  /** @inheritdoc */
  limit(limit: LimitClauseLimit, from: LimitClauseDirection = 'start') {
    return this.next = new LimitBlock(limit, from)
  }
  
  /** @inheritdoc */
  toConstraint() {
    return startAt(this.start)
  }

}

/**
 * Discribes a query block that can create a start at clause as its following block
 */
export interface ICanPrecedeStartAt {
  
  /**
   * Appends a start-at clause to the query
   * @param start Index of the document in the global query from which to start
   */
  startAt(start: StartAtClauseStart): StartAtBlock;

  /**
   * Appends a start-at, end-at and limit block to the query to retrieve a portion of the request
   * @param pageLength Length of the page
   * @param pageIndex Index of the page
   */
  paginate(pageLength: number, pageIndex: number): LimitBlock;
  
}

  /**
   * Appends a start-at and a limit block to the query to retrieve a portion of the request
   * @param pageLength Length of the page
   * @param pageIndex Index of the page
   */
export function paginate(block: ICanPrecedeStartAt, pageLength: number, pageIndex: number): LimitBlock {
    const start = pageLength * pageIndex
    return block.startAt(start).limit(pageLength)
}