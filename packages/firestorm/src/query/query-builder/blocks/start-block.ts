import { QueryClauseField, WhereClauseOperator, WhereClauseValue, OrderClauseDirection, LimitClauseLimit, LimitClauseDirection } from "../params"
import { ICanPrecedeLimit, LimitBlock } from "./limit-block"
import { ICanPrecedeOrderBy, OrderByBlock } from "./order-block"
import { QueryBuildBlock } from "./query-build-block"
import { ICanPrecedeWhere, WhereBlock } from "./where-block"

/**
 * Initial query block of a query.
 */
export class StartBlock 
  extends QueryBuildBlock
  implements ICanPrecedeWhere, ICanPrecedeOrderBy, ICanPrecedeLimit {

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
  limit(limit: LimitClauseLimit, from: LimitClauseDirection = 'start') {
    return this.next = new LimitBlock(limit, from)
  }

  protected toConstraint() { return null }

}
