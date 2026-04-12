import { startAfter, startAt } from "firebase/firestore"
import { QueryBuildBlock } from "./query-build-block"
import { EndAtClauseEnd, LimitClauseDirection, LimitClauseLimit, StartAtClauseStart } from "../params";
import { ICanPrecedeLimit, LimitBlock } from "./limit-block";
import { EndAtBlock, ICanPrecedeEndAt } from "./end-at-block";

/**
 * Start-at query block that gives a starting document index for the query
 */
export class StartAtBlock 
  extends QueryBuildBlock
  implements ICanPrecedeLimit, ICanPrecedeEndAt {

  /**
   * Start-at query block that gives a starting document index for the query
   * 
   * @param start Index of the first document in the query (1-indexed)
   * @param included If true, the first document is in the result set, if false, it starts after this index
   */
  constructor(
    public readonly start: StartAtClauseStart,
    public readonly included: boolean = true
  ) {
    super()
  }

  /** @inheritdoc */
  endAt(end: EndAtClauseEnd, included: boolean = false): EndAtBlock {
    return this.next = new EndAtBlock(end, included)
  }

  /** @inheritdoc */
  limit(limit: LimitClauseLimit, from: LimitClauseDirection = 'start') {
    return this.next = new LimitBlock(limit, from)
  }
  
  /** @inheritdoc */
  toConstraint() {
    return this.included ? startAt(this.start) : startAfter(this.start)
  }

}

/**
 * Describes a query block that can create a start at clause as its following block
 */
export interface ICanPrecedeStartAt {
  
  /**
   * Appends a start-at clause to the query
   * @param start Index of the document in the global query from which to start (1-indexed)
   */
  startAt(start: StartAtClauseStart): StartAtBlock;

  /**
   * Appends a start-at, end-at and limit block to the query to retrieve a portion of the request
   * @param pageLength Length of the page
   * @param pageIndex Index of the page (0-indexed)
   */
  paginate(pageLength: number, pageIndex: number): LimitBlock;
  
}

  /**
   * Appends a start-at and a limit block to the query to retrieve a portion of the request
   * @param block Block after which you want to paginate
   * @param pageLength Length of the page
   * @param pageIndex Index of the page
   */
export function paginate(block: ICanPrecedeStartAt, pageLength: number, pageIndex: number): LimitBlock {
    const start = pageLength * pageIndex + 1
    return block.startAt(start).limit(pageLength)
}