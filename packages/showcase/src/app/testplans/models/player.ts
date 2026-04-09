import { Model, FirestormId, Ignore, ToSubCollection, ToCollection, ToDocument, ToSubDocument, MapType } from "@jiway/firestorm-core";
import { RunRecap } from "./run-recap";

export const MAIN_CONFIG_DOCUMENT_ID = "main_config"

@Model("player_configs")
export class PlayerConfig {

    @Ignore()
    id: FirestormId = ""

    @MapType()
    numericParams = new Map<string, number>()
    
}

@Model("players")
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