import { TestPlan } from "@modules/tests"
import { CRUD_COLLECTION_REPO, CRUD_DOCUMENT_REPO } from "./groups"


export const MAIN_TEST_PLAN = new TestPlan(
    [
        CRUD_COLLECTION_REPO.setIgnore(),
        CRUD_DOCUMENT_REPO
    ]
)
export const ALL_TEST_PLANS = [MAIN_TEST_PLAN]