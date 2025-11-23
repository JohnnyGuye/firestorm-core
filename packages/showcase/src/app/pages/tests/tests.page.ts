import { Component } from "@angular/core";
import { MAIN_TEST_PLAN } from "@testplans";
import { MatTreeModule } from "@angular/material/tree";
import { MatIcon } from "@angular/material/icon";
import { GroupTester, ITester } from "@modules/tests";
import { MatButton, MatIconButton } from "@angular/material/button";
import { TestStateComponent, TestStateComponentMode } from "@components/test-state-tag";

@Component({
    standalone: true,
    templateUrl: 'tests.page.html',
    styleUrls: [
        "tests.page.scss"
    ],
    imports: [
    MatTreeModule,
    MatIcon,
    MatButton,
    TestStateComponent,
    MatIconButton
]
})
export class TestsPage {

    TestStateComponentMode = TestStateComponentMode

    testPlan = MAIN_TEST_PLAN

    childrenAccessor = (tester: ITester) => {
        if (tester instanceof GroupTester) {
            return tester.testers
        }
        return []
    }

    hasChild = (_: number, tester: ITester) => {
        if (tester instanceof GroupTester) {
            return true
        }

        return false
    }

    get testState() {
        return this.testPlan.state
    }

    run() {
        this.testPlan.run()
    }

    reset() {
        this.testPlan.reset()
    }
}