import { ITest } from "./test"

export class TestGroup implements ITest {

    public readonly tests: ITest[] = []

    constructor(public readonly name: string, public readonly description: string = "") {}

    addTest(test: ITest) {
        this.tests.push(test)
        return this
    }

    addTests(tests: Iterable<ITest>) {
        this.tests.push(...tests)
        return this
    }

}