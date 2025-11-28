import { Collection, DateType, Ignore, MapTo, ToMany, ToManyRelationship, ToOne, ToOneRelationship } from "@jiway/firestorm-core";
import { Person } from "./person";
import { ArcanaCard } from "./arcana-card";

@Collection("arcana_loadouts")
export class ArcanaLoadout {

    @Ignore()
    id: string = ""

    name: string = ""

    @ToMany({ target: ArcanaCard, location: '..' })
    cards = new ToManyRelationship(ArcanaCard)

    @ToOne({ target: Person, location: '..' })
    owner = new ToOneRelationship(Person)

    @DateType()
    createdAt: Date = new Date()

    @Ignore()
    notPersistedData: boolean = false

    @MapTo("shortened_field")
    fieldWithANameThatIsLongAndIWantSomethingShorter: string = ""


    // get totalCost() {
    //     return [...this.cards.models].reduce((pv, cv) => cv.cost + pv, 0)
    // }

}