import { TestGroup, Test } from "../tests"
import { fuzeStates, TestState } from "./state"
import { ITester } from "./tester.interface"
import { UnitTester } from "./unit-tester"

export class GroupTester implements ITester {

    private _test: TestGroup

    public testers: ITester[] = []

    constructor(testGroup: TestGroup) {

        this._test = testGroup
        this.testers = GroupTester.Testerify(testGroup)

    }

    private static Testerify(testGroup: TestGroup) {
        return testGroup
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

        await this.runBeforeAllAsync()

        for (let tester of this.testers) {
            
            if (tester.ignore) {
                tester.markAsIgnored()
                continue;
            }

            await this.runBeforeEachAsync()

            await tester.run()

            await this.runAfterEachAsync()

        }

        await this.runAfterAllAsync()
    }

    /** @inheritdoc */
    public markAsIgnored(): void {
        for (let tester of this.testers) {
            tester.markAsIgnored()
        }
    }

    /** @inheritdoc */
    reset(): void {
        for (let tester of this.testers) {
            tester.reset()
        }
    }
    
    /** @inheritdoc */
    get state() {
        return fuzeStates(this.states)
    }

    /**
     * Amount of direct children tests that are successful
     */
    get successfulChildrenCount() {
        return this.testers.filter(t => t.state == TestState.Success).length
    }

    /**
     * Amount of direct children tests
     */
    get directChildrenCount() {
        return this.testers.length
    }

    /** @inheritdoc */
    public get ignore() {
        return this._test.ignore
    }

    private get states() {
        return this.testers.map(t => t.state)
    }


    //#region  Inner hooks

    private async runBeforeAllAsync() {
        await this._test.runBeforeAllAsync()
    }

    private async runBeforeEachAsync() {
        await this._test.runBeforeEachAsync()
    }

    private async runAfterAllAsync() {
        await this._test.runAfterAllAsync()
    }

    private async runAfterEachAsync() {
        await this._test.runAfterEachAsync()
    }

    //#endregion

}