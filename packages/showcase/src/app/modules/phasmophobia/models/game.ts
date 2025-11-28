import { Collection, DateType, Ignore, ToOne, ToOneRelationship } from "@jiway/firestorm-core";
import { PhasmoEntity } from "./entity";

@Collection({ collection: 'games' })
export class PhasmoGame {

  @Ignore()
  id: string = ""

  @DateType()
  createdAt: Date = new Date()
  
  /** Id of the ghost entity */
  @ToOne({ target: PhasmoEntity, location: '.' })
  ghostEntity = new ToOneRelationship(PhasmoEntity)

}