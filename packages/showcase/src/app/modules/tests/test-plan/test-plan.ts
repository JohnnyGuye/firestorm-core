import { Test, TestGroup, TestPackage } from "../tests" 
import { TestState } from "./state";



export class TestResult {

    constructor(public readonly error?: unknown) {}

    get success() {
        return !this.error
    }

}

export interface ITester {

    run(): Promise<void>;

    reset(): void;

    readonly state: TestState

}

export class UnitTester implements ITester {

    private _state: TestState = TestState.Idle
    private _result?: TestResult

    constructor(private readonly _test: Test) {}

    public get name() {
        return this._test.name
    }

    public get description() {
        return this._test.description
    }

    public async run() {

        this.reset()
        this._state = TestState.Running

        try {
            await this._test.test()
            this._state = TestState.Success
        }
        catch(err) {
            this._result = new TestResult(err)
            this._state = TestState.Failed
            console.error(err)
        }

    }

    public reset() {
        this._state = TestState.Idle
        this._result = undefined
    }

    public get state() {
        return this._state
    }

    public get result() {
        return this._result
    }

}

export class GroupTester implements ITester {

    private _test: TestGroup
    public testers: ITester[] = []

    constructor(testGroup: TestGroup) {

        this._test = testGroup
        this.testers = 
            testGroup
                .tests
                .map(t => {
                    if (t instanceof Test) {
                        return new UnitTester(t)
                    } else if (t instanceof TestGroup) {
                        return new GroupTester(t)
                    } else {
                        throw new Error("Unsupported test")
                    }
                })

    }

    public get name() {
        return this._test.name
    }

    public get description() {
        return this._test.description
    }

    public async run() {
        this.reset()
        for (let tester of this.testers) {
            for (let before of this._test.beforeEachTests) {
                await before()
            }
            await tester.run()
        }
    }

    reset(): void {
        for (let tester of this.testers) {
            tester.reset()
        }
    }
    
    get state() {

        const ss = this.states
        if (ss.some(s => s == TestState.Running)) {
            return TestState.Running
        }

        if (ss.some(s => s == TestState.Failed)) {
            return TestState.Failed
        }

        if (ss.every(s => s == TestState.Success)) {
            return TestState.Success
        }

        return TestState.Idle
    }

    get successfulChildrenCount() {
        return this.testers.filter(t => t.state == TestState.Success).length
    }

    get directChildrenCount() {
        return this.testers.length
    }

    private get states() {
        return this.testers.map(t => t.state)
    }


}

export class TestPlan {

    private _rootGroup: GroupTester

    constructor(tests: TestPackage) {
        const tg = new TestGroup("__root__")
        tg.addTests(tests)
        this._rootGroup = new GroupTester(tg)
    }

    public get root() {
        return this._rootGroup
    }

    run() {
        this._rootGroup.run()
    }

    reset() {
        this._rootGroup.reset()
    }

    get state() {
        return this._rootGroup.state
    }

}