import { Collection, Ignore } from "@jiway/firestorm-core";

@Collection({ collection: 'playgrounds/phasmophobia/games' })
export class PhasmoGame {

  @Ignore()
  id: string = ""

  /** Id of the ghost entity */
  ghostEntity: string = ""

}