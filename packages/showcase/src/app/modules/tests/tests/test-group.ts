import { AsyncTestFn, isTest, ITest, Test } from "./test"

export type BeforeEachTestFn = () => Promise<void>

export class TestGroup implements ITest {

    public readonly tests: ITest[] = []

    public readonly beforeEachTests: BeforeEachTestFn[] = []

    constructor(public readonly name: string, public readonly description: string = "") {}

    addTest(test: ITest): this;
    addTest(name: string, testFn: AsyncTestFn): this; 
    addTest(nameOrTest: ITest | string, testFn?: AsyncTestFn): this {

        if (typeof nameOrTest === "string" && typeof testFn === "function") {
            return this.addTestFunction(nameOrTest, testFn)
        }

        if (isTest(nameOrTest)) {
            return this.addTestObject(nameOrTest)
        }

        throw new Error("Unhandled params")
    }

    private addTestObject(test: ITest): this {
        this.tests.push(test)
        return this
    }

    private addTestFunction(name: string, testFn: AsyncTestFn) {
        this.tests.push(new Test(name, testFn))
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