import { TestPlan } from "@modules/tests"
import { CRUD_COLLECTION_REPO_TESTS, CRUD_DOCUMENT_REPO_TESTS, DECORATORS_TESTS, DERIVED_REPO_TESTS, INCLUDES_TESTS } from "./test-groups"

const ignor = true

export const MAIN_TEST_PLAN = new TestPlan(
    [
        CRUD_COLLECTION_REPO_TESTS  .setIgnore(ignor  ),
        CRUD_DOCUMENT_REPO_TESTS    .setIgnore(ignor  ),
        DERIVED_REPO_TESTS          .setIgnore(ignor  ),
        DECORATORS_TESTS            .setIgnore(ignor  ),
        INCLUDES_TESTS              .setIgnore(false )
    ]
)
export const ALL_TEST_PLANS = [MAIN_TEST_PLAN]