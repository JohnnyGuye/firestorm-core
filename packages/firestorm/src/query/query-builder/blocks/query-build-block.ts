import { QueryConstraint } from "firebase/firestore"
import { IQueryBuildBlock } from "./query-build-block.interface"

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
