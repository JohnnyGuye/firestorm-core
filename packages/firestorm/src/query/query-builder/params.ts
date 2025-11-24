import { WhereFilterOp } from "firebase/firestore"

/**
 * Field name of the query clause
 */
export type QueryClauseField = string

/**
 * Operators available for where clauses
 */
export type WhereClauseOperator = WhereFilterOp

/**
 * List of inequality operators
 */
export const inequalityOperators: WhereClauseOperator[] = ['<', '<=', '!=', 'not-in', '>', '>='] as const

/**
 * Inequality operators
 */
export type InequalityOperators = typeof inequalityOperators[number]

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
 * Start for the Start-at Clause
 */
export type StartAtClauseStart = number

/**
 * End for the End-at Clause
 */
export type EndAtClauseEnd = number
