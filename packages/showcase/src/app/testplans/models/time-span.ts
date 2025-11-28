import { ComplexType, FirestormModel } from "@jiway/firestorm-core"

export class Timespan {

    private _span: number = 0

    constructor(milliseconds: number = 0) {}

    setTime(milliseconds: number) {
        this._span = milliseconds
    }

    getTime() {
        return this._span
    }
    
    get totalMilliseconds() {
        return this._span % 1000
    }

    get totalSeconds() {
        return Math.floor(this._span / 1000)
    }

    get seconds() {
        return this.totalSeconds % 60
    }

    get totalMinutes() {
        return Math.floor(this._span / (1000 * 60) )
    }

    get minutes() {
        return this.totalMinutes % 60
    }

    get totalHours() {
        return Math.floor(this._span / (1000 * 60 * 60))
    }

    get hours() {
        return this.totalHours % 24
    }

    get totalDays() {
        return Math.floor(this._span / (1000 * 60 * 60 * 24))
    }

    get days() {
        return this.totalDays
    }

}

export function TimespanType<T_model extends FirestormModel, K extends string>() {
  return ComplexType<Timespan, T_model, K>({
    toModel: (value) => typeof value === "number" ? new Timespan(value) : new Timespan(),
    toDocument: (t: Timespan) => t.getTime()
  })
}