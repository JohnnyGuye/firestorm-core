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
            .addTest("Create one", 
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
            .addTest("Create one with given id", 
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
            .addTest("Create multiple", 
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
            .addTest("Check existency",
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
            .addTest("Read all",
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
            .addTest("Read one",
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
            .addTest("Update existing",
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
            .addTest("Update throws on non existing",
                async () => {
                    
                    const fOrm = getFirestorm()
                    const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT)
                    
                    await expect(
                        async () => { 
                            await personRepo.updateAsync({ id: "non existing", name: "Changed name"}) 
                        })
                        .toThrowAsync()
                }
            )
            .addTest("Aggregate",
                async () => {

                    const fOrm = getFirestorm()
                    const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT)

                    const ps = []
                    for (let i = 0; i < 5; i++) {
                        const p = getRandomPerson()
                        p.age = 20 + i
                        ps.push(p)
                    }

                    await personRepo.createMultipleAsync(...ps)

                    const aggRes = await personRepo.aggregateAsync({
                        amountOfPeople: { verb: 'count' },
                        averageAgeOfPeople: { verb: 'average', field: 'age' },
                        sumAgeOfPeople: { verb: 'sum', field: 'age' }
                    })

                    const aggExpected = {
                        amountOfPeople: 5,
                        averageAgeOfPeople: 22,
                        sumAgeOfPeople: 110
                    }

                    expect(aggRes).toBe(aggExpected)
                    
                }
            )
            .addTest("Delete one",
                async () => {

                    const fOrm = getFirestorm()
                    const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT)

                    const ps = []
                    for (let i = 0; i < 5; i++) {
                        const p = getRandomPerson()
                        ps.push(p)
                    }
                    await personRepo.createMultipleAsync(...ps)

                    const countBeforeDelete = await personRepo.aggregateAsync({ count: { verb: 'count' }})

                    await personRepo.deleteAsync(ps[2].id)

                    await personRepo.deleteAsync(ps[3])

                    const countAfterDelete = await personRepo.aggregateAsync({ count: { verb: 'count' }})

                    expect(countBeforeDelete.count).toEqual(countAfterDelete.count + 2)
                }
            )
            .addTest("Delete multiple",
                async () => {

                    const fOrm = getFirestorm()
                    const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT)

                    const ps = []
                    for (let i = 0; i < 5; i++) {
                        const p = getRandomPerson()
                        ps.push(p)
                    }
                    await personRepo.createMultipleAsync(...ps)

                    const countBeforeDelete = await personRepo.aggregateAsync({ count: { verb: 'count' }})

                    await personRepo.deleteMultipleAsync([ps[2].id, ps[3].id])

                    const countAfterDelete = await personRepo.aggregateAsync({ count: { verb: 'count' }})

                    await personRepo.deleteMultipleAsync([ps[0].id, ps[1].id])

                    const countAfterSecondDelete = await personRepo.aggregateAsync({ count: { verb: 'count' }})

                    expect(countBeforeDelete.count).toEqual(countAfterDelete.count + 2)
                    expect(countBeforeDelete.count).toEqual(countAfterSecondDelete.count + 4)
                }
            )
    ]
)
export const ALL_TEST_PLANS = [MAIN_TEST_PLAN]