import { default as environment } from "@environment";
import { Firestorm } from "@jiway/firestorm-core";
import { generateName } from "@modules/random";
import { Person } from "@testplans/models";


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