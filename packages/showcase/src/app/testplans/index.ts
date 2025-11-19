import { Test, TestGroup, TestPlan } from "@modules/tests"


export const MAIN_TEST_PLAN = new TestPlan(
    [
        new Test("dummy", () => {}),
        new TestGroup("dummy group", "")
        .addTest(new Test("dg dummy", "Heya", () => {}))
    ]
)
export const ALL_TEST_PLANS = [MAIN_TEST_PLAN]