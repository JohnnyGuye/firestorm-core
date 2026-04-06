import { generateName, getRandomsInArray } from "@modules/random";
import { TestGroup } from "@modules/tests";
import { ArcanaCard, Player } from "@testplans/models";
import { ArcanaLoadout } from "@testplans/models/arcana-loadout";
import { expect } from "@modules/tests/matcher"
import { RunRecap } from "@testplans/models/run-recap";
import { Timespan } from "@testplans/models/time-span";
import { getFirestorm, getPersonRepo, getRandomPerson, UNIT_TEST_DB_ROOT } from "@testplans/utilities";

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
            debugger
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

            console.log(al, retrieveAl)
            expect(retrieveAl!.cards.ids).toBe(al.cards.ids)
            expect(retrieveAl!.cards.models).toBeOfLength(5)
        }
    )
    .addTest("@SubCollection (in collection repo)",
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

            const playerWithRuns = await repo.getByIdAsync(p.id, { runRecaps: true })
            console.log(playerWithRuns)

            expect(playerWithRuns?.runRecaps).toBeOfLength(2)
        }
    )