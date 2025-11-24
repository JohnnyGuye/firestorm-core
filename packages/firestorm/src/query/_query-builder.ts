import { limit, limitToLast, orderBy, OrderByDirection, QueryConstraint, where, WhereFilterOp } from "firebase/firestore"

/**
 * Field name of the query clause
 */
export type QueryClauseField = string

/**
 * Operators available for where clauses
 */
export type WhereClauseOperator = WhereFilterOp

/**
 * Values for where clauses
 */
export type WhereClauseValue = unknown

/**
 * Direction of the order for order clauses
 */
export type OrderClauseDirection = 'ascending' | 'descending'

/**
 * Limit for Limit clauses
 */
export type LimitClauseLimit = number

/**
 * Limit from for limit clauses
 */
export type LimitClauseDirection = 'start' | 'end'

/**
 * List of inequality operators
 */
export const inequalityOperators: WhereClauseOperator[] = ['<', '<=', '!=', 'not-in', '>', '>='] as const
/**
 * Inequality operators
 */
export type InequalityOperators = typeof inequalityOperators[number]

/**
 * Discribes the minimal requirements for a query block
 */
export interface IQueryBuildBlock {

  /**
   * A reference to the previous query block if this block is the first
   */
  readonly previous: IQueryBuildBlock | null
  /**
   * A reference to the next query block or null if this block is the last
   */
  readonly next: IQueryBuildBlock | null
  /**
   * Converts the full chain to a firebase set of query constraints
   * @returns Firebase query constraints equivalent to this query
   */
  toConstraints(): QueryConstraint[];
}

/**
 * @summary Type guard for {@link IQueryBuildBlock}
 * 
 * It works by duck typing the top level without checking the values of the properties so be mindful.
 * 
 * @param value Object to typeguard
 * @returns 
 */
export function isQueryBuildBlock(value: unknown): value is IQueryBuildBlock  {
  if (!value || typeof value !== 'object') return false
  return 'previous' in value
    && 'next' in value
    && 'toConstraints' in value
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

/**
 * Discribes a query block that can create an order by clause as its following block
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

/**
 * Base behavior for a query block
 */
export abstract class QueryBuildBlock implements IQueryBuildBlock {

  private _previous: QueryBuildBlock | null = null
  private _next: QueryBuildBlock | null = null

  /** @inheritdoc */
  get previous(): QueryBuildBlock | null { return this._previous }

  /** 
   * Sets the reference to the previous query block
   * @param value The soon to be previous query block
   */
  protected set previous(value: QueryBuildBlock | null) {

    if (this._previous) {
      console.warn("Overriding the chain, previous block was", this._previous)
    }
    this._previous = value
    if (value && value.next != this) {
      value.next = this
    }

  }

  /** @inheritdoc */
  get next(): QueryBuildBlock | null { return this._next }

  /**
   * Sets the reference to the next query block
   * @param value The soon to be next query block
   */
  protected set next(value: QueryBuildBlock | null) {

    if (this._next) {
      console.warn("Overriding the chain, previous block was", this._next)
    }
    this._next = value
    if (value && value.previous != this) {
      value.previous = this
    }

  }

  /**
   * Gets a reference to the block at the start of the chain
   */
  protected get root(): QueryBuildBlock {
    if (this.previous) return this.previous.root
    return this
  }

  /**
   * Gets a reference to the block at the end of the chain
   */
  protected get leaf(): QueryBuildBlock {
    if (this.next) return this.next.leaf
    return this
  }

  /**
   * Check whether or not this block as a following block
   */
  get hasNext() {
    return !!this.next
  }

  /** 
   * Converts this block to the corresponding query constraint
   */
  protected abstract toConstraint(): QueryConstraint | null;

  /**
   * Gets the full chain of query blocks as an array of blocks
   */
  private get flattenedChain() {

    const blocks = []
    let currentBlock: QueryBuildBlock | null = this.root

    while (currentBlock) {
      blocks.push(currentBlock)
      currentBlock = currentBlock.next
    }

    return blocks
  }

  /** @inheritdoc */
  toConstraints(): QueryConstraint[] {

    return this.flattenedChain
      .map(block => block.toConstraint())
      .filter(Boolean) as QueryConstraint[]
  }
}


/**
 * Where clause query block that restricts the query to documents matching the query
 */
export class WhereBlock 
  extends QueryBuildBlock
  implements ICanPrecedeWhere, ICanPrecedeOrderBy, ICanPrecedeLimit {

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
  limit(limit: LimitClauseLimit, from: LimitClauseDirection = 'start') {
    return this.next = new LimitBlock(limit, from)
  }

  /** @inheritdoc */
  protected toConstraint() {
    return where(this.field, this.operator, this.value)
  }

}

/**
 * Order by query block that orders the documents by a property
 */
export class OrderByBlock 
  extends QueryBuildBlock
  implements ICanPrecedeOrderBy, ICanPrecedeLimit {

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