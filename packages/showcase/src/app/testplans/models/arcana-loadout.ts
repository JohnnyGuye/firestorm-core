import { Collection, DateType, Ignore, ToOne, ToOneRelationship } from "@jiway/firestorm-core";
import { Person } from "./person";

@Collection("arcana_loadouts")
export class ArcanaLoadout {

    @Ignore()
    id: string = ""

    name: string = ""

    // @ToMany({ target: ArcanaCard, location: 'sibling' })
    // cards = new ToManyRelationship(ArcanaCard)

    @ToOne({ target: Person, location: 'sibling' })
    owner = new ToOneRelationship(Person)

    @DateType()
    createAt: Date = new Date()

    @Ignore()
    notPersistedData: boolean = false


    // get totalCost() {
    //     return [...this.cards.models].reduce((pv, cv) => cv.cost + pv, 0)
    // }

}