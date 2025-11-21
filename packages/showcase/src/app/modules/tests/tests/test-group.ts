import { ITest } from "./test"

export type BeforeEachTestFn = () => Promise<void>

export class TestGroup implements ITest {

    public readonly tests: ITest[] = []

    public readonly beforeEachTests: BeforeEachTestFn[] = []

    constructor(public readonly name: string, public readonly description: string = "") {}

    addTest(test: ITest) {
        this.tests.push(test)
        return this
    }

    addTests(tests: Iterable<ITest>) {
        this.tests.push(...tests)
        return this
    }

    beforeEachTest(fn: BeforeEachTestFn) {
        this.beforeEachTests.push(fn)
        return this
    }

}