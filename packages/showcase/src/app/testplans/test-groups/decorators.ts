import { generateName, getRandomInArray, getRandomsInArray } from "@modules/random";
import { TestGroup } from "@modules/tests";
import { ArcanaCard, Person, PREDEFINED_ARCANAS } from "@testplans/models";
import { ArcanaLoadout } from "@testplans/models/arcana-loadout";
import { getFirestorm, getRandomPerson, UNIT_TEST_DB_ROOT } from "@testplans/utilities";
import { expect } from "@modules/tests/matcher"
import { createCollectionCrudRepositoryInstantiator, createDocumentCrudRepositoryInstantiator } from "@jiway/firestorm-core";
import { RunRecap } from "@testplans/models/run-recap";

/*
✔️ collection
✔️ ignore
✔️ tomany
✔️ toone
✔️ mapto
✔️ datetype
complexetype
subcollection
subdocument
*/

function getPersonRepo() {
    return getFirestorm().getCrudRepository(Person, UNIT_TEST_DB_ROOT)
}

function getTestingPerson() {

    const person = new Person()
    
    person.id = "__me_as_tester__"
    person.age = 32
    person.name = "May"
    person.surname = "Shelf"

    return person
}

function getTestingPersonRepo() {
    const tester = getTestingPerson()
    return getFirestorm().getSingleDocumentCrudRepository(Person, tester.id, UNIT_TEST_DB_ROOT)
}

function getRunrecapRepoOfTestingPerson() {
    return getTestingPersonRepo()
        .getRepositoryFromFunction(
            createCollectionCrudRepositoryInstantiator(),
            RunRecap,
            "."
        )
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
    .addTest("",
        async () => {
            
            const repo = getRunrecapRepoOfTestingPerson()

            console.log(repo.collectionPath)
        }
    )
    .addTest("@ComplexType (explicit option)",
        async () => {

            
        }
    )
    .addTest("@ComplexType (extended)",
        async () => {

        }
    )