import { generateName, getRandomInArray, getRandomsInArray } from "@modules/random";
import { TestGroup } from "@modules/tests";
import { ArcanaCard, Person, PREDEFINED_ARCANAS } from "@testplans/models";
import { ArcanaLoadout } from "@testplans/models/arcana-loadout";
import { getFirestorm, getRandomPerson, UNIT_TEST_DB_ROOT } from "@testplans/utilities";
import { expect } from "@modules/tests/matcher"

/*
✔️ collection
✔️ ignore
✔️ datetype
complexetype
mapto
subcollection
subdocument
tomany
toone
*/

function getPersonRepo() {
    return getFirestorm().getCrudRepository(Person, UNIT_TEST_DB_ROOT)
}

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
    .addTest("Collection",
        async () => {
            // Automatically passed if any other test passed 
        }
    )
    .addTest("Ignore",
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
    .addTest("Date type",
        async () => {

            // Check if the documents contains the id

            const repo = getArcanaLoadoutRepo()

            const al = await generateValidArcanaLoadoutAsync()
            al.createAt = new Date(2020, 2, 4)

            await repo.createAsync(al)

            const retrievedAl = await repo.getByIdAsync(al.id)
            expect(retrievedAl).toNotBeNull()
            expect(al.createAt).toBe(retrievedAl!.createAt)
        }
    )
    .addTest("To one (id storage)", 
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
    .addTest("To one (retrieve by include)", 
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
    .addTest("To many",
        async () => {

            const repo = getArcanaLoadoutRepo()

            const al = await generateValidArcanaLoadoutAsync()

            await repo.createAsync(al)

            const retrieveAl = await repo.getByIdAsync(al.id)

            console.log(al, retrieveAl)
            expect(retrieveAl!.cards.ids).toBe(al.cards.ids)
            expect(retrieveAl!.cards.models).toBeOfLength(0)
        }
    )