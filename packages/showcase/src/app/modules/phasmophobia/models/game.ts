import { Model, DateType, Ignore, ToOne, ToOneRelationship } from "@jiway/firestorm-core";
import { PhasmoEntity } from "./entity";

@Model({ collection: 'games' })
export class PhasmoGame {

  @Ignore()
  id: string = ""

  @DateType()
  createdAt: Date = new Date()
  
  /** Id of the ghost entity */
  @ToOne({ targetType: PhasmoEntity, location: '.' })
  ghostEntity = new ToOneRelationship(PhasmoEntity)

}