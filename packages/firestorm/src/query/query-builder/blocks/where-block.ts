import { where } from "firebase/firestore"
import { QueryClauseField, WhereClauseOperator, WhereClauseValue, OrderClauseDirection, LimitClauseLimit, LimitClauseDirection, EndAtClauseEnd, StartAtClauseStart } from "../params"
import { ICanPrecedeLimit, LimitBlock } from "./limit-block"
import { ICanPrecedeOrderBy, OrderByBlock } from "./order-block"
import { QueryBuildBlock } from "./query-build-block"
import { ICanPrecedeEndAt, EndAtBlock } from "./end-at-block"
import { ICanPrecedeStartAt, paginate, StartAtBlock } from "./start-at-block"

/**
 * Where clause query block that restricts the query to documents matching the query
 */
export class WhereBlock 
  extends QueryBuildBlock
  implements ICanPrecedeWhere, ICanPrecedeOrderBy, ICanPrecedeLimit, ICanPrecedeStartAt, ICanPrecedeEndAt {

  /** 
   * Creates a where clause query block that restricts the query to documents matching the query
   * @param field The document field on which the clause will be applied
   * @param operator The operation that will be applied to this field
   * @param value The value against which the the value in the field will be tested
   */
  constructor(
    public readonly field: QueryClauseField,
    public readonly operator: WhereClauseOperator, 
    public readonly value: WhereClauseValue
    ) {
      super()
    }

  /** @inheritdoc */
  where(
    field: QueryClauseField,
    operator: WhereClauseOperator, 
    value: WhereClauseValue
  ): WhereBlock {
    return this.next = new WhereBlock(field, operator, value)
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
    return where(this.field, this.operator, this.value)
  }

}

/**
 * Discribes a query block that can create a where clause as its following block
 */
export interface ICanPrecedeWhere {

  /**
   * Appends a where clause to the query
   * @param field Field on which the where clause is applied
   * @param operator Operator of the clause
   * @param value Value to check against the value of the field against
   * @returns The {@link WhereBlock} appended to the query
   */
  where(field: QueryClauseField, operator: WhereClauseOperator, value: WhereClauseValue): WhereBlock

}
