import { TestGroup, TestPackage } from "../tests" 
import { GroupTester } from "./group-tester";

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