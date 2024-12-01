import { QueryConstraint } from "firebase/firestore";
import { LimitClauseDirection, LimitClauseLimit, OrderClauseDirection, QueryClauseField, StartBlock, WhereClauseOperator, WhereClauseValue } from "./query-builder";

export type QueryCheckEntryLevel = 'warning' | 'error'

export abstract class QueryCheckEntry {

  constructor(public readonly level: QueryCheckEntryLevel, public readonly message: string) {}

}

export class TooManyConstraintsQueryError extends QueryCheckEntry {

  constructor() {
    super('error', "Too many constraints in this query. It cannot exceed 100.")
  }
  
}

export class InequalityOperatorsOnDifferentFieldQueryError extends QueryCheckEntry {

  constructor(public readonly fields: string[]) {
    super('error', "All where filters with an inequality must be on the same field. You have filters on: " + fields.join(", "))
  }

}

/*
Warning: A != query clause might match many documents in a collection. To control the number of results returned, use a limit clause or paginate your query.
Warning: A not-in query clause might match many documents in a collection. To control the number of results returned, use a limit clause or paginate your query.
Only documents where the given field exists can match the query.
You can't combine not-in and != in a compound query.
In a compound query, range (<, <=, >, >=) and not equals (!=, not-in) comparisons must all filter on the same field.

Note the following limitations for in, not-in, and array-contains-any:

in, not-in, and array-contains-any support up to 10 comparison values.
You can use at most one array-contains clause per query. You can't combine array-contains with array-contains-any.
You can use at most one in, not-in, or array-contains-any clause per query. You can't combine these operators in the same query.
You can't combine not-in with not equals !=.
You can't order your query by a field included in an equality (==) or in clause.

Cloud Firestore provides limited support for logical OR queries. The in, and array-contains-any operators support a logical OR of up to 10 equality (==) or array-contains conditions on a single field. For other cases, create a separate query for each OR condition and merge the query results in your app.
You can use at most one array-contains clause per query. You can't combine array-contains with array-contains-any.
You can use at most one in, not-in, or array-contains-any clause per query. You can't combine in , not-in, and array-contains-any in the same query.
You can't order your query by a field included in an equality (==) or in clause.
The sum of filters, sort orders, and parent document path (1 for a subcollection, 0 for a root collection) in a query cannot exceed 100.
*/

export class Query {

  private _startBlock: StartBlock = new StartBlock()

  private get start() { return this._startBlock }

  /**
   * Adds a where clause to the query
   * @param field Field on which the where clause is applied
   * @param operator Operator of the clause
   * @param value Value to check against the value of the field against
   * @returns 
   */
  where(
    field: QueryClauseField,
    operator: WhereClauseOperator, 
    value: WhereClauseValue
  ) {
    return this.start.where(field, operator, value)
  }

  /**
   * Adds an order by clause to the query
   * @param field Field on which to apply the sorting
   * @param direction Direction of the sort
   * @returns 
   */
  orderBy(
    field: QueryClauseField,
    direction: OrderClauseDirection
  ) {
    return this.start.orderBy(field, direction)
  }

  /**
   * Adds a limit clause to the query
   * @param limit Amount of element to query at most
   * @param from Starts from the start or the end of the query
   * @returns 
   */
  limit(limit: LimitClauseLimit, from: LimitClauseDirection = 'start') {
    return this.start.limit(limit, from)
  }
  
  toConstraints(): QueryConstraint[] {
    return this.start.toConstraints()
  }
}