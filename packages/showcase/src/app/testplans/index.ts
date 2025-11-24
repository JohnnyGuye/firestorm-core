import { CollectionDocumentTuple, CollectionDocumentTuples, FirestormId, Query } from "@jiway/firestorm-core";
import { Test, TestGroup, TestPlan } from "@modules/tests"
import { expect } from "@modules/tests/matcher"
import { getFirestorm, getRandomPeople, getRandomPerson } from "./utilities";

import { Person, sortByRank } from "./models";
import { ArcanaCard, PREDEFINED_ARCANAS } from "./models";



const UNIT_TEST_DB_ROOT = new CollectionDocumentTuples([new CollectionDocumentTuple<any>("playgrounds", "unit_test")])

export const MAIN_TEST_PLAN = new TestPlan(
    [
        new Test(
            "Crud repo can CREATE", 
            async () => {}
        ),
        new TestGroup("CRUD repo", "")
            .addBeforeAllTest(async () => {
                const arcanaRepo = getFirestorm().getCrudRepository(ArcanaCard, UNIT_TEST_DB_ROOT)
                await arcanaRepo.deleteAllAsync()
                await arcanaRepo.createMultipleAsync(...PREDEFINED_ARCANAS)

            })
            .addBeforeEachTest(async () => {
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
            .addTest("Delete all",
                async () => {

                    const fOrm = getFirestorm()
                    const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT)

                    const ps = []
                    for (let i = 0; i < 5; i++) {
                        const p = getRandomPerson()
                        ps.push(p)
                    }

                    await personRepo.createMultipleAsync(...ps)
                    
                    {
                        const all = await personRepo.getAllAsync()
                        
                        expect(all).toBeOfLength(5)
                    }

                    await personRepo.deleteAllAsync()

                    {
                        const all = await personRepo.getAllAsync()
    
                        expect(all).toBeOfLength(0)
                    }
                }
            )
            .addTest("Listen add change",
                async () => {
                    
                    let failureTo: any
                    let insertionInterval: any
                    let subscription: any

                    try {
                        
                        await new Promise<void>(
                            async (resolve, reject) => {
    
                                const fOrm = getFirestorm();
                                const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT);
    
                                const listener = personRepo.listen();
    
                                subscription = listener.subscribe({
                                    next: (x_1) => {
    
                                        if (x_1.count >= 5) {
                                            resolve()
                                        }
    
                                        if (!x_1.isInitial) {
                                            if (x_1.docChanges.length != 1) {
                                                reject(new Error("Wrong amount of changes"))
                                            }
        
                                            if (x_1.docChanges[0].type != 'added') {
                                                reject(new Error("Should only be additions"))
                                            }
                                        }
                                    }
                                });
    
                                failureTo = setTimeout(() => { reject(new Error("Time Out")); }, 1000);
    
                                insertionInterval = setInterval(async () => {
                                    
                                    const p = await personRepo.createAsync(getRandomPerson())
                                    
                                }, 100)
    
                            }
                        );

                    } finally {

                        subscription.unsubscribe();
                        clearTimeout(failureTo);
                        clearInterval(insertionInterval)

                    }


                }
            )
            .addTest("Listen on query add change",
                async () => {
                    
                    let failureTo: any
                    let insertionInterval: any
                    let subscription: any

                    const fOrm = getFirestorm();
                    const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT);

                    const TIME_ALLOCATED_BY_PEOPLE = 50
                    const PEOPLE_TO_GENERATE_COUNT = 6
                    const MAX_TO = TIME_ALLOCATED_BY_PEOPLE * PEOPLE_TO_GENERATE_COUNT * 2

                    try {
                        
                        await new Promise<void>(
                            async (resolve, reject) => {
    

                                const listener = personRepo.listen(new Query().where("age", ">=", 70));
    
                                subscription = listener.subscribe({
                                    next: (x_1) => {
    
                                        if (x_1.count >= PEOPLE_TO_GENERATE_COUNT) {
                                            resolve()
                                        }
    
                                        if (!x_1.isInitial) {
                                            if (x_1.docChanges.length != 1) {
                                                reject(new Error("Wrong amount of changes"))
                                            }
        
                                            if (x_1.docChanges[0].type != 'added') {
                                                reject(new Error("Should only be additions"))
                                            }
                                        }
                                    }
                                });
    
                                failureTo = setTimeout(() => { reject(new Error("Time Out")); }, MAX_TO);
    
                                insertionInterval = setInterval(async () => {
                                    
                                    const youngP = getRandomPerson()
                                    youngP.age = 30

                                    const oldP = getRandomPerson()
                                    oldP.age = 75

                                    await personRepo.createMultipleAsync(youngP, oldP)
                                    
                                }, TIME_ALLOCATED_BY_PEOPLE)
    
                            }
                        );

                    } finally {

                        subscription.unsubscribe();
                        clearTimeout(failureTo);
                        clearInterval(insertionInterval)

                    }

                    const everyone = await personRepo.getAllAsync()
                    expect(everyone).toBeOfLength(PEOPLE_TO_GENERATE_COUNT * 2)

                }
            )
            .addTest("Randomizer base check",
                async () => {

                    const fOrm = getFirestorm()
                    const arcanaRepo = fOrm.getCrudRepository(ArcanaCard, UNIT_TEST_DB_ROOT)

                    const pullsRecords = new Map<FirestormId, number>()

                    const arcanaCount = (await arcanaRepo.aggregateAsync({ count: { verb: 'count' }})).count

                    const pulls = 100
                    let misses = 0
                    for (let i = 0; i < pulls; i++) {
                        
                        const p = await arcanaRepo.getRandomAsync()
                        if (!p) {
                            console.warn("It missed")
                            misses += 1
                            continue
                        }

                        pullsRecords.set(p.id, (pullsRecords.get(p.id) || 0) + 1)

                    }

                    // Check if we pulled at least a third of the cards
                    expect(arcanaCount / 3).toBeLesserThan(pullsRecords.size)
                    
                },
                { ignore: true }
            )
            .addTest("Randomizer quality check",
                async () => {

                    const fOrm = getFirestorm()
                    const arcanaRepo = fOrm.getCrudRepository(ArcanaCard, UNIT_TEST_DB_ROOT)

                    const pullsRecords = new Map<FirestormId, number>()

                    const arcanaCount = (await arcanaRepo.aggregateAsync({ count: { verb: 'count' }})).count

                    const pulls = 1000
                    let misses = 0
                    for (let i = 0; i < pulls; i++) {
                        
                        const p = await arcanaRepo.getRandomAsync()
                        if (!p) {
                            console.warn("It missed")
                            misses += 1
                            continue
                        }

                        pullsRecords.set(p.id, (pullsRecords.get(p.id) || 0) + 1)

                    }

                    // If at least one card is never pulled so the random isn't satisfactory
                    expect(pullsRecords.size).toEqual(arcanaCount)
                    
                    const expectedMeanPullCount = pulls / arcanaCount
                    const meanOfSquaredPulls = [...pullsRecords.values()].reduce((pv, cv) => cv * cv + pv, 0) / arcanaCount

                    const variance = 
                        meanOfSquaredPulls
                        - expectedMeanPullCount * expectedMeanPullCount

                    console.warn(expectedMeanPullCount, meanOfSquaredPulls, variance, misses, pullsRecords)
                    expect(variance).toBeLesserThan(10000)
                },
                { ignore: true }
            )
            .addTest("Query equality",
                async () => {
                    
                    const fOrm = getFirestorm()
                    const arcanaRepo = fOrm.getCrudRepository(ArcanaCard, UNIT_TEST_DB_ROOT)

                    const allArcanas = await arcanaRepo.getAllAsync()
                    const oneCostArcanas = await arcanaRepo.queryAsync(new Query().where("cost", "==", 1))

                    const filteredOneCostArcanas = allArcanas.filter(a => a.cost == 1)

                    expect(oneCostArcanas.sort(sortByRank)).toBe(filteredOneCostArcanas.sort(sortByRank))

                }
            )
            .addTest("Query inequality",
                async () => {
                    
                    const fOrm = getFirestorm()
                    const arcanaRepo = fOrm.getCrudRepository(ArcanaCard, UNIT_TEST_DB_ROOT)

                    const allArcanas = await arcanaRepo.getAllAsync()
                    const notOneCostArcanas = await arcanaRepo.queryAsync(new Query().where("cost", "!=", 1))

                    const filteredNotOneCostArcanas = allArcanas.filter(a => a.cost != 1)

                    expect(notOneCostArcanas.sort(sortByRank)).toBe(filteredNotOneCostArcanas.sort(sortByRank))

                }
            )
            .addTest("Query pagination",
                async () => {
                    
                    const fOrm = getFirestorm()
                    const arcanaRepo = fOrm.getCrudRepository(ArcanaCard, UNIT_TEST_DB_ROOT)

                    const allArcanas = (await arcanaRepo.getAllAsync()).sort(sortByRank)

                    const PAGE_SIZE = 3
                    for (let pageIndex = 0; (pageIndex * PAGE_SIZE) < allArcanas.length; pageIndex++) {

                        const queriedPageArcanas = await arcanaRepo.queryAsync(new Query().orderBy("rank", "ascending").paginate(PAGE_SIZE, pageIndex))
                        const localArcanas = allArcanas.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE)

                        console.log(queriedPageArcanas, localArcanas)
                        expect(queriedPageArcanas).toBe(localArcanas)
                    }

                    // const notOneCostArcanas = await arcanaRepo.queryAsync(new Query().where("cost", "!=", 1))

                    // const filteredNotOneCostArcanas = allArcanas.filter(a => a.cost != 1)

                    // console.warn(filteredNotOneCostArcanas, notOneCostArcanas)
                    // expect(notOneCostArcanas.sort(sortByRank)).toBe(filteredNotOneCostArcanas.sort(sortByRank))

                }
            )
    ]
)
export const ALL_TEST_PLANS = [MAIN_TEST_PLAN]