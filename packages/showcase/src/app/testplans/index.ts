import { CollectionDocumentTuple, CollectionDocumentTuples } from "@jiway/firestorm-core";
import { Test, TestGroup, TestPlan } from "@modules/tests"
import { getFirestorm } from "./utilities";

import { Person } from "./models";



const UNIT_TEST_DB_ROOT = new CollectionDocumentTuples([new CollectionDocumentTuple<any>("playgrounds", "unit-test")])

export const MAIN_TEST_PLAN = new TestPlan(
    [
        new Test(
            "dummy", 
            async () => {
                
                const fOrm = getFirestorm()
                const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT)
                
                const p = new Person()
                p.name = "John"
                p.surname = "Doe"

                const p2 = await personRepo.createAsync(p)
                
            }
        ),
        new TestGroup("dummy group", "")
            .addTest(
                new Test(
                    "dg dummy", 
                    "Heya", 
                    async () => new Promise(
                        (resolve, reject) => {
                            setTimeout(() => resolve(), 1000)
                        })
                )
            )
    ]
)
export const ALL_TEST_PLANS = [MAIN_TEST_PLAN]