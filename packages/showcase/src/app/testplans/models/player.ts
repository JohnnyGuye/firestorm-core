import { Collection, FirestormId, Ignore, SubCollection } from "@jiway/firestorm-core";
import { RunRecap } from "./run-recap";

@Collection("players")
export class Player {

    @Ignore()
    id: FirestormId = ""

    pseudo: string = ""

    // @SubCollection({ type: RunRecap})
    // runRecaps = undefined
}