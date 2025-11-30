import { generateName, getRandomsInArray } from "@modules/random";
import { TestGroup } from "@modules/tests";
import { ArcanaCard, Person, Player, PREDEFINED_ARCANAS } from "@testplans/models";
import { ArcanaLoadout } from "@testplans/models/arcana-loadout";
import { getFirestorm, getPersonRepo, getRandomPerson, UNIT_TEST_DB_ROOT } from "@testplans/utilities";
import { expect } from "@modules/tests/matcher"
import { RunRecap } from "@testplans/models/run-recap";
import { Timespan } from "@testplans/models/time-span";

/*
✔️ collection
✔️ ignore
✔️ tomany
✔️ toone
✔️ mapto
✔️ datetype
✔️ complexetype
subcollection
subdocument
*/

function getArcanaRepo() {
    return getFirestorm().getCrudRepository(ArcanaCard, UNIT_TEST_DB_ROOT)
}

function getArcanaLoadoutRepo() {
    return getFirestorm().getCrudRepository(ArcanaLoadout, UNIT_TEST_DB_ROOT)
}

async function generateValidArcanaLoadoutAsync() {

    const arcanas = await getArcanaRepo().getAllAsync()
    const al = new ArcanaLoadout()

    const pickedArcanas = getRandomsInArray(arcanas, 5)
    al.name = generateName()
    al.cards.setModels(pickedArcanas)

    return al
}

function getTestingPlayer() {
    const p = new Player()

    p.id = "_predefined_testing_player_id_"
    p.pseudo = "TheOriginalTester"

    return p
}

function getTestingPlayerRepo() {
    const p = getTestingPlayer()
    return getFirestorm()
        .getSingleDocumentCrudRepository(Player, p.id, UNIT_TEST_DB_ROOT)
}

function getTestingPlayerRecapsRepo() {
    return getTestingPlayerRepo().getCollectionCrudRepository(RunRecap)
}

export default new TestGroup("Decorators")
    .addBeforeAllTest(async () => {
        const fOrm = getFirestorm()

        await getArcanaRepo().deleteAllAsync()
        const arcanas = await getArcanaRepo().createMultipleAsync(...PREDEFINED_ARCANAS)
        
        const personRepo = fOrm.getCrudRepository(Person, UNIT_TEST_DB_ROOT)
        await personRepo.deleteAllAsync()
    })
    .addBeforeEachTest(async () => {
        await getArcanaLoadoutRepo().deleteAllAsync()
    })
    .addTest("@Collection",
        async () => {
            // Automatically passed if any other test passed 
        }
    )
    .addTest("@Ignore",
        async () => {

            // Check if the documents contains the id

            const repo = getArcanaLoadoutRepo()

            const al = await generateValidArcanaLoadoutAsync()
            al.notPersistedData = true

            await repo.createAsync(al)

            expect(al.notPersistedData).toBeTrue()

            const retrievedAl = await repo.getByIdAsync(al.id)
            expect(retrievedAl?.notPersistedData).toBeFalse()
            expect(al.notPersistedData).toNotBe(retrievedAl?.notPersistedData)
        }
    )
    .addTest("@DateType",
        async () => {

            // Check if the documents contains the id

            const repo = getArcanaLoadoutRepo()

            const al = await generateValidArcanaLoadoutAsync()
            al.createdAt = new Date(2020, 2, 4)

            await repo.createAsync(al)

            const retrievedAl = await repo.getByIdAsync(al.id)

            expect(retrievedAl).toNotBeNull()
            expect(al.createdAt).toBe(retrievedAl!.createdAt)
        }
    )
    .addTest("@ToOne (id storage)", 
        async () => {

            const repo = getArcanaLoadoutRepo()
            const person = getRandomPerson()

            await getPersonRepo().createAsync(person)

            const al = await generateValidArcanaLoadoutAsync()
            al.owner.setModel(person)

            await repo.createAsync(al)

            const retrievedAl = await repo.getByIdAsync(al.id)

            expect(retrievedAl?.owner.id).toBe(al.owner.id)
            expect(retrievedAl?.owner.model).toBeNull()

        }
    )
    .addTest("@ToOne (retrieve by include)", 
        async () => {

            const repo = getArcanaLoadoutRepo()
            const person = getRandomPerson()

            await getPersonRepo().createAsync(person)

            const al = await generateValidArcanaLoadoutAsync()
            al.owner.setModel(person)

            await repo.createAsync(al)

            const retrievedAl = await repo.getByIdAsync(al.id, { owner: true })

            expect(retrievedAl?.owner.model).toBe(al.owner.model)

        }
    )
    .addTest("@ToMany",
        async () => {

            const repo = getArcanaLoadoutRepo()

            const al = await generateValidArcanaLoadoutAsync()

            await repo.createAsync(al)

            const retrieveAl = await repo.getByIdAsync(al.id)

            expect(retrieveAl!.cards.ids).toBe(al.cards.ids)
            expect(retrieveAl!.cards.models).toBeOfLength(0)
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
    .addTest("@MapTo",
        async () => {

            const repo = getArcanaLoadoutRepo()

            const al = new ArcanaLoadout()
            const doc = repo.modelToDocument(al)

            expect(doc).toHaveTheField("shortened_field")
            expect(doc).toNotHaveTheField("fieldWithANameThatIsLongAndIWantSomethingShorter")
            expect(doc).toNotHaveTheField("field_with_a_name_that_is_long_and_i_want_something_shorter")

        }
    )
    .addTest("@ComplexType (explicit option)",
        async () => {
            
            const repo = getTestingPlayerRecapsRepo()

            const rr = new RunRecap()

            rr.duration = new Timespan(400 * 1000)
            rr.finishedAt = new Date(2020, 3, 7, 18, 12, 11, 137)
            rr.pauseDuration = new Timespan(122 * 1000)

            await repo.createAsync(rr)

            const retrieved = await repo.getByIdAsync(rr.id)

            expect(rr.duration.getTime()).toBe(retrieved?.duration.getTime())
            
        }
    )
    .addTest("@ComplexType (extended)",
        async () => {
            
            const repo = getTestingPlayerRecapsRepo()

            const rr = new RunRecap()

            rr.duration = new Timespan(400 * 1000)
            rr.finishedAt = new Date(2020, 3, 7, 18, 12, 11, 137)
            rr.pauseDuration = new Timespan(122 * 1000)

            await repo.createAsync(rr)

            const retrieved = await repo.getByIdAsync(rr.id)

            expect(rr.pauseDuration.getTime()).toBe(retrieved?.pauseDuration.getTime())

        }
    )
    .addTest("@SubCollection",
        async () => {

        }
    )