import { Type } from "@angular/core";
import { QueryConstraint } from "firebase/firestore";
import { LimitClauseDirection, LimitClauseLimit, OrderClauseDirection, QueryClauseField, StartBlock, WhereClauseOperator, WhereClauseValue } from "./query-builder";

export class Query {

  private _startBlock: StartBlock = new StartBlock()

  private get start() { return this._startBlock }

  where(
    field: QueryClauseField,
    operator: WhereClauseOperator, 
    value: WhereClauseValue
  ) {
    return this.start.where(field, operator, value)
  }

  orderBy(
    field: QueryClauseField,
    direction: OrderClauseDirection
  ) {
    return this.start.orderBy(field, direction)
  }

  limit(limit: LimitClauseLimit, from: LimitClauseDirection = 'start') {
    return this.start.limit(limit, from)
  }

  validityCheck<T>(type: Type<T>): boolean {
    throw new Error("Not implemented")
  }
  
  toConstraints(): QueryConstraint[] {
    return this.start.toConstraints()
  }
}