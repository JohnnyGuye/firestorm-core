import { generateName, getRandomsInArray } from "@modules/random";
import { TestGroup } from "@modules/tests";
import { ArcanaCard, MAIN_CONFIG_DOCUMENT_ID, Player, PlayerConfig, PREDEFINED_ARCANAS } from "@testplans/models";
import { ArcanaLoadout } from "@testplans/models/arcana-loadout";
import { expect } from "@modules/tests/matcher"
import { RunRecap } from "@testplans/models/run-recap";
import { Timespan } from "@testplans/models/time-span";
import { getFirestorm, getPersonRepo, getRandomPerson, UNIT_TEST_DB_ROOT } from "@testplans/utilities";
import { createDocumentCrudRepositoryInstantiator } from "@jiway/firestorm-core";

function getArcanaRepo() {
    return getFirestorm().getCrudRepository(ArcanaCard, UNIT_TEST_DB_ROOT)
}

function getArcanaLoadoutRepo() {
    return getFirestorm().getCrudRepository(ArcanaLoadout, UNIT_TEST_DB_ROOT)
}

function getTestingPlayer() {
    const p = new Player()

    p.id = "_predefined_testing_player_id_"
    p.pseudo = "TheOriginalTester"

    return p
}

async function generateValidArcanaLoadoutAsync() {

    const arcanas = await getArcanaRepo().getAllAsync()
    const al = new ArcanaLoadout()

    const pickedArcanas = getRandomsInArray(arcanas, 5)
    al.name = generateName()
    al.cards.setModels(pickedArcanas)

    return al
}

export default new TestGroup("Includes")
    .addBeforeAllTest(
        async () => {
            const arcanaRepo = getFirestorm().getCrudRepository(ArcanaCard, UNIT_TEST_DB_ROOT)
            await arcanaRepo.deleteAllAsync()
            await arcanaRepo.createMultipleAsync(...PREDEFINED_ARCANAS)
        }   
    )
    .addBeforeEachTest(
        async () => {
            await getArcanaLoadoutRepo().deleteAllAsync()
            await getPersonRepo().deleteAllAsync()
            
        }
    )
    .addBeforeEachTest(
        async () => {
            const p = getTestingPlayer()
            const repo = 
                getFirestorm()
                    .getCrudRepository(Player, UNIT_TEST_DB_ROOT)
        
            const recapRepo =
                getFirestorm()
                    .getCrudRepository(RunRecap, [UNIT_TEST_DB_ROOT.path, "players", p.id])

            await recapRepo.deleteAllAsync()
            await repo.deleteAsync(p)

        }
    )
    .addTest("@ToOne (retrieve by include)", 
        async () => {

            // Setup DB

            const arcanaRepo = getArcanaLoadoutRepo()
            const person = getRandomPerson()

            await getPersonRepo().createAsync(person)

            const al = await generateValidArcanaLoadoutAsync()
            al.owner.setModel(person)

            await arcanaRepo.createAsync(al)

            // Act
            const retrievedAl = await arcanaRepo.getByIdAsync(al.id, { owner: true })

            // Check

            expect(retrievedAl?.owner.model).toBe(al.owner.model)

        }
    )
    .addTest("@ToMany (retrieve by include)",
        async () => {

            const repo = getArcanaLoadoutRepo()

            const al = await generateValidArcanaLoadoutAsync()

            await repo.createAsync(al)

            const retrieveAl = await repo.getByIdAsync(al.id, { cards: true })

            expect(retrieveAl!.cards.ids).toBe(al.cards.ids)
            expect(retrieveAl!.cards.models).toBeOfLength(5)
        }
    )
    .addTest("@ToCollection & ToSubCollection (retrieve directly below)",
        async () => {
            
            const p = getTestingPlayer()
            
            const repo = 
                getFirestorm()
                    .getCrudRepository(Player, UNIT_TEST_DB_ROOT)

            const recapRepo =
                getFirestorm()
                    .getCrudRepository(RunRecap, [UNIT_TEST_DB_ROOT.path, "players", p.id])

            const r1 = (() => {
                const rr = new RunRecap()

                rr.duration = new Timespan(400 * 1000)
                rr.finishedAt = new Date(2020, 3, 7, 18, 12, 11, 137)
                rr.pauseDuration = new Timespan(122 * 1000)

                return rr
            })()

            const r2 = (() => {
                const rr = new RunRecap()

                rr.duration = new Timespan(300 * 1000)
                rr.finishedAt = new Date(2020, 3, 7, 18, 16, 18, 137)
                rr.pauseDuration = new Timespan(92 * 1000)

                return rr
            })()

            await repo.createAsync(p)

            const rs = await recapRepo.createMultipleAsync(r1, r2)

            const playerWithRuns = await repo.getByIdAsync(p.id, { runRecaps: true, runRecapsWithToCollectionDecorator: true })            

            expect(playerWithRuns).toNotBeNull()
            expect(playerWithRuns?.runRecaps).toBeOfLength(2)
            expect(playerWithRuns?.runRecapsWithToCollectionDecorator).toBeOfLength(2)


            const playerWithoutRuns = await repo.getByIdAsync(p.id)

            expect(playerWithoutRuns).toNotBeNull()
            expect(playerWithoutRuns?.runRecaps).toBeOfLength(0)
            expect(playerWithoutRuns?.runRecapsWithToCollectionDecorator).toBeOfLength(0)

        }
    )
    .addTest("@ToDocument & ToSubDocument (retrieve directly below)",
        async () => {

            const p = getTestingPlayer()
            const playerRepo = 
                getFirestorm()
                    .getSingleDocumentCrudRepository(Player, p.id, UNIT_TEST_DB_ROOT)

            const playerConfigRepo = playerRepo.getRepositoryFromFunction(
                createDocumentCrudRepositoryInstantiator(MAIN_CONFIG_DOCUMENT_ID), PlayerConfig, "."
            )

            const playerConfigSource = new PlayerConfig()
            playerConfigSource.numericParams.set("screenposx", 100)
            playerConfigSource.numericParams.set("screenposy", 300)

            await playerRepo.writeAsync(p)
            await playerConfigRepo.writeAsync(playerConfigSource)
            
            const retrievedPlayer = await playerRepo.getAsync({ mainConfig: true, mainConfigFromSubDocument: true })
            
            expect(retrievedPlayer?.mainConfig).toNotBeNull()
            expect(retrievedPlayer?.mainConfigFromSubDocument).toNotBeNull()

            expect(retrievedPlayer?.mainConfig).toBe(playerConfigSource)
            expect(retrievedPlayer?.mainConfigFromSubDocument).toBe(playerConfigSource)

        }
    )