// export class QueryBuilder {

import { limit, limitToLast, orderBy, OrderByDirection, QueryConstraint, where, WhereFilterOp } from "firebase/firestore"

//   private _start: StartBlock = new StartBlock()

//   get start() {
//     return this._start
//   }

// }

export type QueryClauseField = string
export type WhereClauseOperator = WhereFilterOp
export type WhereClauseValue = any
export type OrderClauseDirection = 'ascending' | 'descending'
export type LimitClauseLimit = number
export type LimitClauseDirection = 'start' | 'end'

export interface IQueryBuildBlock {

  readonly previous: IQueryBuildBlock | null
  readonly next: IQueryBuildBlock | null

  // readonly root: IQueryBuildBlock;

  // readonly hasNext: boolean

  // toConstraint(): QueryConstraint | null

  toConstraints(): QueryConstraint[]
}

abstract class QueryBuildBlock implements IQueryBuildBlock {

  private _previous: QueryBuildBlock | null = null
  private _next: QueryBuildBlock | null = null

  get previous(): QueryBuildBlock | null { return this._previous }
  protected set previous(value: QueryBuildBlock | null) {
    if (this._previous) {
      console.warn("Overriding the chain, previous block was", this._previous)
    }
    this._previous = value
    if (value && value.next != this) {
      value.next = this
    }
  }

  get next(): QueryBuildBlock | null { return this._next }
  protected set next(value: QueryBuildBlock | null) {
    if (this._next) {
      console.warn("Overriding the chain, previous block was", this._next)
    }
    this._next = value
    if (value && value.previous != this) {
      value.previous = this
    }
  }

  protected get root(): QueryBuildBlock {
    if (this.previous) return this.previous.root
    return this
  }

  protected get leaf(): QueryBuildBlock {
    if (this.next) return this.next.leaf
    return this
  }

  get hasNext() {
    return !!this.next
  }

  protected abstract toConstraint(): QueryConstraint | null;

  toConstraints(): QueryConstraint[] {

    let currentBlock: QueryBuildBlock | null = this.root
    let constraints = []

    while(currentBlock) {
      let constraint = currentBlock.toConstraint()
      if (constraint) {
        constraints.push(constraint)
      }
      currentBlock = currentBlock.next
    }

    return constraints
  }

}

export class StartBlock extends QueryBuildBlock {

  where(
    field: QueryClauseField,
    operator: WhereClauseOperator, 
    value: WhereClauseValue
  ) {
    this.next = new WhereBlock(field, operator, value)
    return this.next
  }

  orderBy(
    field: QueryClauseField,
    direction: OrderClauseDirection
  ) {
    this.next = new OrderyByBlock(field, direction)
    return this.next
  }

  limit(limit: LimitClauseLimit, from: LimitClauseDirection = 'start') {
    this.next = new LimitBlock(limit, from)
    return this.next
  }

  protected toConstraint() { return null }

}

class WhereBlock extends QueryBuildBlock {

  constructor(
    public readonly field: QueryClauseField,
    public readonly operator: WhereClauseOperator, 
    public readonly value: WhereClauseValue
    ) {
      super()
    }

  where(
    field: QueryClauseField,
    operator: WhereClauseOperator, 
    value: WhereClauseValue
  ) {
    this.next = new WhereBlock(field, operator, value)
    return this.next
  }

  orderBy(
    field: QueryClauseField,
    direction: OrderClauseDirection
  ) {
    this.next = new OrderyByBlock(field, direction)
    return this.next
  }

  limit(limit: LimitClauseLimit, from: LimitClauseDirection = 'start') {
    this.next = new LimitBlock(limit, from)
    return this.next
  }

  protected toConstraint() {
    return where(this.field, this.operator, this.value)
  }

}

class OrderyByBlock extends QueryBuildBlock {

  constructor(
    public readonly field: QueryClauseField,
    public readonly direction: OrderClauseDirection
  ) {
    super()
  }

  orderBy(
    field: QueryClauseField,
    direction: OrderClauseDirection
  ) {
    this.next = new OrderyByBlock(field, direction)
    return this.next
  }

  limit(limit: LimitClauseLimit, from: LimitClauseDirection = 'start') {
    this.next = new LimitBlock(limit, from)
    return this.next
  }

  protected toConstraint() {
    return orderBy(this.field, this.firestoreDirection)
  }

  private static firestoreOrderByDirection(direction: OrderClauseDirection): OrderByDirection {
    switch(direction) {
      case 'ascending': return 'asc'
      case 'descending': return 'desc'
    }
  }

  private get firestoreDirection() {
    return OrderyByBlock.firestoreOrderByDirection(this.direction)
  }


}

class LimitBlock extends QueryBuildBlock {

  constructor(
    public readonly limit: LimitClauseLimit,
    public readonly from: LimitClauseDirection
  ) {
    super()
  }

  toConstraint() {
    switch(this.from) {
      case 'start': return limit(this.limit)
      case 'end': return limitToLast(this.limit)
    }
  }

}