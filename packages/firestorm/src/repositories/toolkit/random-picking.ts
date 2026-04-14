import { FirestoreIdBase } from "../../core"

interface DichotomyCursor<T = string> {

    value: T

    index: number

}

export class DichotomicResearch {

    private _base = new FirestoreIdBase()

    public readonly fullRange: number

    public readonly aimIndex: number

    public startCursor: DichotomyCursor

    public endCursor: DichotomyCursor

    constructor(fullRange: number, aimIndex: number) {

        this.fullRange = fullRange
        this.aimIndex = aimIndex

        this.startCursor = {
            value: "".padEnd(20, this._base.valueToChar(0)),
            index: 0
        }

        this.endCursor = {
            value: "".padEnd(20, this._base.valueToChar(this._base.radix - 1)),
            index: this.fullRange
        }

    }

    advance(pivotValue: string, startToPivotCount: number) {
        
        let lowIndex = this.startCursor.index
        let medianIndex = this.startCursor.index + startToPivotCount
        let endIndex = this.startCursor.index + this.cursorRange

        // In the lower part
        if (lowIndex <= this.aimIndex && this.aimIndex <= medianIndex) {

            this.endCursor.value = pivotValue
            this.endCursor.index = medianIndex

        } 
        // In the higher part
        else if (medianIndex < this.aimIndex && this.aimIndex <= endIndex) {

            this.startCursor.value = pivotValue
            this.startCursor.index = medianIndex

        } else {

            // logWarn("Not suppsoed to happen", pivotValue, startToPivotCount)

        }

    }

    get pivotValue() {
        return this._base.lerp(this.startCursor.value, this.endCursor.value, 1, 2)
    }

    get cursorRange() {
        return this.endCursor.index - this.startCursor.index
    }

    get aimIndexRelativeToStartCursor() {
        return this.aimIndex - this.startCursor.index
    }

    snapshot() {
        return {
            aimIndex: this.aimIndex,
            fullRange: this.fullRange,
            fromIdx: this.startCursor.index,
            toIdx: this.endCursor.index,
            localRange: this.cursorRange,
            from: this.startCursor.value,
            to: this.endCursor.value
        }
    }

}