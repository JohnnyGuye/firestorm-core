import { CollectionDocumentTuple, CollectionDocumentTuples } from "@jiway/firestorm-core";
import { Test, TestGroup, TestPlan } from "@modules/tests"
import { expect } from "@modules/tests/matcher"
import { getFirestorm, getRandomPerson } from "./utilities";

import { Person } from "./models";



const UNIT_TEST_DB_ROOT = new CollectionDocumentTuples([new CollectionDocumentTuple<any>("playgrounds", "unit_test")])

export const MAIN_TEST_PLAN = new TestPlan(
    [
        new Test(
            "Crud repo can CREATE", 
            async () => {}
        ),
        new TestGroup("CRUD repo", "")
            .beforeEachTest(async () => {
                const personRepo = getFirestorm().getCrudRepository(Person, UNIT_TEST_DB_ROOT)
                await personRepo.deleteAllAsync()
            })
            .addTest(
                new Test(
                    "Create one", 
                    async () => {
                        
                        const fOrm = getFirestorm()
                        const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT)
                        
                        const p = new Person()
                        p.name = "John"
                        p.surname = "Doe"

                        const p2 = await personRepo.createAsync(p)

                        expect(p).toShareReferenceWith(p2)
                        expect(p.id).toNotBeNull()
                    }
                )
            )
            .addTest(
                new Test(
                    "Create one with given id", 
                    async () => {
                        
                        const fOrm = getFirestorm()
                        const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT)
                        
                        const p = new Person()
                        p.id = "fixed_id"
                        p.name = "John"
                        p.surname = "Doe"

                        const p2 = await personRepo.createAsync(p)

                        expect(p).toShareReferenceWith(p2)
                        expect(p.id).toNotBeNull()
                        expect(p.id).toEqual("fixed_id")
                    }
                )
            )
            .addTest(
                new Test(
                    "Create multiple", 
                    async () => {
                        
                        const fOrm = getFirestorm()
                        const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT)
                        
                        const p1 = getRandomPerson()
                        const p2 = getRandomPerson()
                        const p3 = getRandomPerson()

                        const ps = await personRepo.createMultipleAsync(p1, p2, p3)

                        expect(ps).toBeOfLength(3)

                    }
                )
            )
            .addTest(
                "Check existency",
                async () => {
                    const fOrm = getFirestorm()
                    const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT)

                    const p = getRandomPerson()

                    await personRepo.createAsync(p)

                    const pExist = await personRepo.existsAsync(p.id)
                    const pDoesntExist = await personRepo.existsAsync("not_registered_id")

                    expect(pExist).toBeTrue()
                    expect(pExist).toBe(pExist)
                    expect(pDoesntExist).toBeFalse()
                }
            )
            .addTest(
                "Read all",
                async () => {
                    
                    const fOrm = getFirestorm()
                    const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT)
                    
                    const p1 = getRandomPerson()
                    const p2 = getRandomPerson()
                    const p3 = getRandomPerson()

                    await personRepo.createMultipleAsync(p1, p2, p3)
                    const ps = await personRepo.getAllAsync()

                    expect(ps).toBeOfLength(3)

                }
            )
            .addTest(
                "Read one",
                async () => {
                    
                    const fOrm = getFirestorm()
                    const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT)
                    
                    const p1 = getRandomPerson()
                    const p2 = getRandomPerson()
                    const p3 = getRandomPerson()

                    await personRepo.createMultipleAsync(p1, p2, p3)
                    const ps = await personRepo.getByIdAsync(p2.id)

                    expect(ps).toBe(p2)
                    expect(ps).toNotBe(p1)
                    expect(ps).toNotBe(p3)

                }
            )
            .addTest(
                "Update",
                async () => {
                    
                    const fOrm = getFirestorm()
                    const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT)
                    
                    const p = new Person()
                    
                    p.name = "Firstname"
                    p.surname = "Surname"
                    
                    const pComp = new Person()
                    pComp.name = "Firstname"
                    pComp.surname = "Surname"

                    expect(p).toBe(pComp)

                    await personRepo.createAsync(p)
                    
                    expect(p).toNotBe(pComp)

                    await personRepo.updateAsync({ id: p.id, name: "Changed name"})
                    
                    pComp.id = p.id
                    pComp.name = "Changed name"

                    const pUpdated = await personRepo.getByIdAsync(p.id)
                    
                    expect(pUpdated).toBe(pComp)

                }
            )
    ]
)
export const ALL_TEST_PLANS = [MAIN_TEST_PLAN]