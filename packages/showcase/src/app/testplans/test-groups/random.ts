import { expect } from "@modules/tests/matcher"
import { TestGroup } from "@modules/tests";
import { ArcanaCard, Person, PREDEFINED_ARCANAS, sortByRank } from "@testplans/models"
import { getFirestorm, getRandomPerson, UNIT_TEST_DB_ROOT } from "@testplans/utilities"
import { FirestormId, Query } from "@jiway/firestorm-core"

export default new TestGroup("Random picks")
    .addBeforeAllTest(async () => {
        const arcanaRepo = getFirestorm().getCrudRepository(ArcanaCard, UNIT_TEST_DB_ROOT)
        await arcanaRepo.deleteAllAsync()
        await arcanaRepo.createMultipleAsync(...PREDEFINED_ARCANAS)

    })
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
        { ignore: false }
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
        { ignore: false }
    )