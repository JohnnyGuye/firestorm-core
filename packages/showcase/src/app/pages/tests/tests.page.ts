import { Component } from "@angular/core";
import { MAIN_TEST_PLAN } from "@testplans";
import { MatTreeModule } from "@angular/material/tree";
import { MatIcon } from "@angular/material/icon";
import { GroupTester, ITester, TestGroup } from "@modules/tests";

@Component({
    standalone: true,
    templateUrl: 'tests.page.html',
    imports: [
    MatTreeModule,
    MatIcon
]
})
export class TestsPage {

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
}