import { Collection, FirestormId, Ignore, ToSubCollection, ToCollection } from "@jiway/firestorm-core";
import { RunRecap } from "./run-recap";

@Collection("players")
export class Player {

    @Ignore()
    id: FirestormId = ""

    pseudo: string = ""

    @ToSubCollection({ targetType: RunRecap })
    runRecaps = new Map<FirestormId, RunRecap>()

    @ToCollection({ targetType: RunRecap, location: "." })
    runRecapsWithToCollectionDecorator = new Map<FirestormId, RunRecap>()

}