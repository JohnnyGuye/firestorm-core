import { Collection, ComplexType, DateType, Ignore } from "@jiway/firestorm-core";
import { Timespan, TimespanType } from "./time-span";

@Collection("run_recaps")
export class RunRecap {

    @Ignore()
    id: string = ""

    @DateType()
    finishedAt = new Date()

    @ComplexType({
        toDocument: (t: Timespan) => t.getTime(),
        toModel: (value) => typeof value === "number" ? new Timespan(value) : new Timespan()
    })
    duration: Timespan = new Timespan()

    @TimespanType()
    pauseDuration: Timespan = new Timespan()
}