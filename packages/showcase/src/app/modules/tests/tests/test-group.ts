import { AsyncTestFn, isTest, ITest, Test, TestOptions } from "./test"

export type BeforeAllTestFn = () => Promise<void>
export type BeforeEachTestFn = () => Promise<void>
export type AfterAllTestFn = () => Promise<void>
export type AfterEachTestFn = () => Promise<void>

export class TestGroup implements ITest {

    private readonly beforeAllTests: BeforeAllTestFn[] = []
    private readonly beforeEachTests: BeforeEachTestFn[] = []
    private readonly afterAllTests: AfterAllTestFn[] = []
    private readonly afterEachTests: AfterEachTestFn[] = []


    public readonly tests: ITest[] = []
    
    public ignore: boolean = false


    constructor(public readonly name: string, public readonly description: string = "") {}

    addTest(test: ITest): this;
    addTest(name: string, testFn: AsyncTestFn, options?: TestOptions): this; 
    addTest(nameOrTest: ITest | string, testFn?: AsyncTestFn, options?: TestOptions): this {

        if (typeof nameOrTest === "string" && typeof testFn === "function") {
            const t = 
                new Test(nameOrTest, testFn)
                    .setIgnore(!!options && options.ignore)
            return this.addTestObject(t)
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

    addTests(tests: Iterable<ITest>) {
        this.tests.push(...tests)
        return this
    }

    addBeforeAllTest(fn: BeforeAllTestFn) {
        this.beforeAllTests.push(fn)
        return this
    }

    addBeforeEachTest(fn: BeforeEachTestFn) {
        this.beforeEachTests.push(fn)
        return this
    }

    addAfterAllTest(fn: BeforeAllTestFn) {
        this.afterAllTests.push(fn)
        return this
    }

    addAfterEachTest(fn: BeforeEachTestFn) {
        this.afterEachTests.push(fn)
        return this
    }

    public async runBeforeAllAsync() {
        for (let before of this.beforeAllTests) {
            await before()
        }
    }

    public async runBeforeEachAsync() {
        for (let before of this.beforeEachTests) {
            await before()
        }
    }

    public async runAfterAllAsync() {
        for (let after of this.afterAllTests) {
            await after()
        }
    }

    public async runAfterEachAsync() {
        for (let after of this.afterAllTests) {
            await after()
        }
    }

}