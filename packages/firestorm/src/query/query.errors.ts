
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