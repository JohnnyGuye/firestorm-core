import { Collection, FirestormId, Ignore, ToSubCollection, ToCollection, ToDocument, ToSubDocument } from "@jiway/firestorm-core";
import { RunRecap } from "./run-recap";

export const MAIN_CONFIG_DOCUMENT_ID = "main_config"

@Collection("player_configs")
export class PlayerConfig {

    @Ignore()
    id: FirestormId = ""

    
    numericParams = new Map<string, number>()
    
}

@Collection("players")
export class Player {

    @Ignore()
    id: FirestormId = ""

    pseudo: string = ""

    @ToSubCollection({ targetType: RunRecap })
    runRecaps = new Map<FirestormId, RunRecap>()

    @ToCollection({ targetType: RunRecap, location: "." })
    runRecapsWithToCollectionDecorator = new Map<FirestormId, RunRecap>()

    @ToDocument({ targetType: PlayerConfig, location: ".", documentId: MAIN_CONFIG_DOCUMENT_ID })
    mainConfig: PlayerConfig | null = null

    @ToSubDocument({ targetType: PlayerConfig, documentId: MAIN_CONFIG_DOCUMENT_ID })
    mainConfigFromSubDocument: PlayerConfig | null = null

}