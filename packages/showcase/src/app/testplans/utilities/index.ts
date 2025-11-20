import { default as environment } from "@environment";
import { Firestorm } from "@jiway/firestorm-core";

export function getFirestorm() {

    const phasmo = environment.firebaseConfigurations.phasmo
    const firestorm = new Firestorm()
    firestorm.connect(phasmo)
    

    if (environment.dev.useEmulator) {
        console.info('%cUsing the firestore emulated database.', 'color: purple; background: aquamarine; font-weight: 700; font-size: 2em');
        firestorm.useEmulator()
    }

    return firestorm
}