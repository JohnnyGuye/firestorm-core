import { TestPlan } from "@modules/tests"
import { CRUD_COLLECTION_REPO_TESTS, CRUD_DOCUMENT_REPO_TESTS, DECORATORS_TESTS, DERIVED_REPO_TESTS } from "./test-groups"


export const MAIN_TEST_PLAN = new TestPlan(
    [
        CRUD_COLLECTION_REPO_TESTS  .setIgnore(false ),
        CRUD_DOCUMENT_REPO_TESTS    .setIgnore(false ),
        DERIVED_REPO_TESTS          .setIgnore(false ),
        DECORATORS_TESTS            .setIgnore(false )
    ]
)
export const ALL_TEST_PLANS = [MAIN_TEST_PLAN]