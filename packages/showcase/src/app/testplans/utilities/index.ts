import { default as environment } from "@environment";
import { createCollectionCrudRepositoryInstantiator, Firestorm, Path } from "@jiway/firestorm-core";
import { generateName } from "@modules/random";
import { Person } from "@testplans/models";
import { RunRecap } from "@testplans/models/run-recap";

export const UNIT_TEST_DB_ROOT = Path.fromSegments(["playgrounds", "unit_test"])

let firestorm: Firestorm | undefined = undefined

export function getFirestorm() {

    if (firestorm) return firestorm

    const phasmo = environment.firebaseConfigurations.phasmo
    firestorm = new Firestorm()
    firestorm.connect(phasmo)
    

    if (environment.dev.useEmulator) {
        console.info('%cUsing the firestore emulated database.', 'color: purple; background: aquamarine; font-weight: 700; font-size: 2em');
        firestorm.useEmulator()
    }

    return firestorm
}

export function getRandomPerson() {

    const name = generateName().split(" ")

    const p = new Person()
    p.name = name[0]
    p.surname = name[1]
    
    return p
}

export function* getRandomPeople(count: number) {

    for (let i = 0; i < count; i++) {
        yield getRandomPerson()
    }

}

export function getPersonRepo() {
    return getFirestorm().getCrudRepository(Person, UNIT_TEST_DB_ROOT)
}

export function getTestingPerson() {

    const person = new Person()
    
    person.id = "__me_as_tester__"
    person.age = 32
    person.name = "May"
    person.surname = "Shelf"

    return person
}

export function getTestingPersonRepo() {
    const tester = getTestingPerson()
    return getFirestorm().getSingleDocumentCrudRepository(Person, tester.id, UNIT_TEST_DB_ROOT)
}

export function getRunrecapRepoOfTestingPerson() {
    return getTestingPersonRepo()
        .getRepositoryFromFunction(
            createCollectionCrudRepositoryInstantiator(),
            RunRecap,
            "."
        )
}
