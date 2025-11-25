import { TestPlan } from "@modules/tests"
import { CRUD_COLLECTION_REPO_TESTS, CRUD_DOCUMENT_REPO_TESTS, DECORATORS_TESTS } from "./groups"


export const MAIN_TEST_PLAN = new TestPlan(
    [
        CRUD_COLLECTION_REPO_TESTS.setIgnore(),
        CRUD_DOCUMENT_REPO_TESTS.setIgnore(),
        DECORATORS_TESTS
    ]
)
export const ALL_TEST_PLANS = [MAIN_TEST_PLAN]