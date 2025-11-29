import { orderBy, OrderByDirection } from "firebase/firestore"
import { EndAtClauseEnd, LimitClauseDirection, LimitClauseLimit, OrderClauseDirection, QueryClauseField, StartAtClauseStart } from "../params"
import { ICanPrecedeLimit, LimitBlock } from "./limit-block"
import { QueryBuildBlock } from "./query-build-block"
import { ICanPrecedeStartAt, paginate, StartAtBlock } from "./start-at-block"
import { EndAtBlock, ICanPrecedeEndAt } from "./end-at-block"

/**
 * Order by query block that orders the documents by a property
 */
export class OrderByBlock 
  extends QueryBuildBlock
  implements ICanPrecedeOrderBy, ICanPrecedeLimit, ICanPrecedeStartAt, ICanPrecedeEndAt {

  /**
   * Creates an order by query block that orders the documents by a property
   * @param field The ordering document field
   * @param direction The direction of the order, ascending or descending
   */
  constructor(
    public readonly field: QueryClauseField,
    public readonly direction: OrderClauseDirection
  ) {
    super()
  }

  /** @inheritdoc */
  orderBy(
    field: QueryClauseField,
    direction: OrderClauseDirection
  ) {
    return this.next = new OrderByBlock(field, direction)
  }

  /** @inheritdoc */
  paginate(pageLength: number, pageIndex: number): LimitBlock {
    return paginate(this, pageLength, pageIndex)
  }

  /** @inheritdoc */
  startAt(start: StartAtClauseStart): StartAtBlock {
    return this.next = new StartAtBlock(start)
  }
  
  /** @inheritdoc */
  endAt(end: EndAtClauseEnd): EndAtBlock {
    return this.next = new EndAtBlock(end)
  }

  /** @inheritdoc */
  limit(limit: LimitClauseLimit, from: LimitClauseDirection = 'start') {
    return this.next = new LimitBlock(limit, from)
  }

  /** @inheritdoc */
  protected toConstraint() {
    return orderBy(this.field, this.firestoreDirection)
  }

  /** Converts this direction's to a firebase direction */
  private get firestoreDirection() {
    return OrderByBlock.firestoreOrderByDirection(this.direction)
  }
  
  /** Converts a query builder direction instruction to a firebase instruciton */
  private static firestoreOrderByDirection(direction: OrderClauseDirection): OrderByDirection {
    switch(direction) {
      case 'ascending': return 'asc'
      case 'descending': return 'desc'
    }
  }

}


/**
 * Describes a query block that can create an order by clause as its following block
 */
export interface ICanPrecedeOrderBy {

  /**
   * Appends an order by clause to the query
   * @param field Field on which to apply the sorting
   * @param direction Direction of the sort
   * @returns The {@link OrderByBlock} appended to the query
   */
  orderBy(field: QueryClauseField, direction: OrderClauseDirection): OrderByBlock;

}