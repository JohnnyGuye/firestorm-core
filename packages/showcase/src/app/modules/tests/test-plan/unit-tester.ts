import { Test } from "../tests"
import { TestState } from "./state"
import { TestResult } from "./test-result"
import { ITester } from "./tester.interface"

export class UnitTester implements ITester {

    private _state: TestState = TestState.Idle
    private _result?: TestResult

    constructor(private readonly _test: Test) {}

    /** @inheritdoc */
    public get name() {
        return this._test.name
    }

    /** @inheritdoc */
    public get description() {
        return this._test.description
    }

    /** @inheritdoc */
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

    /** @inheritdoc */
    public markAsIgnored(): void {
        this._state = TestState.Ignored
    }

    /** @inheritdoc */
    public reset() {
        this._state = TestState.Idle
        this._result = undefined
    }

    /** @inheritdoc */
    public get state() {
        return this._state
    }

    /** @inheritdoc */
    public get result() {
        return this._result
    }

    /** @inheritdoc */
    public get ignore() {
        return this._test.ignore
    }

}
