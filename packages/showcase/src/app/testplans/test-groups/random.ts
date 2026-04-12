import { expect } from "@modules/tests/matcher"
import { TestGroup } from "@modules/tests";
import { ArcanaCard, Person, PREDEFINED_ARCANAS, sortByRank } from "@testplans/models"
import { getFirestorm, getRandomPerson, UNIT_TEST_DB_ROOT } from "@testplans/utilities"
import { createCollectionCrudRepositoryInstantiator, FirestormId, Query } from "@jiway/firestorm-core"
import { createRandomRepositoryInstantiator } from "@firestorm-experimental/random-repository";

export default new TestGroup("Random picks")
    .addBeforeAllTest(async () => {
        const arcanaRepo = getFirestorm().getCrudRepository(ArcanaCard, UNIT_TEST_DB_ROOT)
        await arcanaRepo.deleteAllAsync()
        await arcanaRepo.createMultipleAsync(...PREDEFINED_ARCANAS)

    })
    .addTest("Randomizer base check",
        async () => {

            const fOrm = getFirestorm()
            const arcanaCrudRepo = fOrm.getRepositoryFromFunction(createCollectionCrudRepositoryInstantiator(), ArcanaCard, UNIT_TEST_DB_ROOT)
            const arcanaRandomRepo = fOrm.getRepositoryFromFunction(createRandomRepositoryInstantiator(), ArcanaCard, UNIT_TEST_DB_ROOT)

            const allCards = await arcanaCrudRepo.queryAsync(new Query().orderBy("__name__", "ascending"))

            const rv = Math.floor(Math.random() * allCards.length)

            const expectedCard = allCards[rv]

            console.warn(rv, allCards.map(c => c.id), expectedCard.id)
            const pickedCard = await arcanaRandomRepo.pick(rv)

            expect(expectedCard).toBe(pickedCard)

        }
    )
    .addTest("Randomizer base check",
        async () => {

            const fOrm = getFirestorm()
            const arcanaRepo = fOrm.getRepositoryFromFunction(createRandomRepositoryInstantiator(), ArcanaCard, UNIT_TEST_DB_ROOT)

            const pullsRecords = new Map<FirestormId, number>()

            const arcanaCount = (await arcanaRepo.aggregateAsync({ count: { verb: 'count' }})).count

            const pulls = 1
            let misses = 0
            for (let i = 0; i < pulls; i++) {
                
                const p = await arcanaRepo.pick()
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