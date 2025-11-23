import { Collection, FirestormId } from "@jiway/firestorm-core";

@Collection("arcana_cards")
export class ArcanaCard {

    id: FirestormId = ""

    name: string = ""

    cost: number = 0

    rank: number = 1

    constructor();
    constructor(id: FirestormId, name: string, rank: number, cost: number);
    constructor(id?: FirestormId, name?: string, rank?: number, cost?: number) {
        if (id) {
            this.id = id
        }

        if (name) {
            this.name = name
        }

        if (rank) {
            this.rank = rank
        }

        if (cost) {
            this.cost = cost
        }
    }

}

export const PREDEFINED_ARCANAS = [
    new ArcanaCard("", "The Sorceress", 1, 1),
    new ArcanaCard("", "The Wayward Son", 2, 1),
    new ArcanaCard("", "The Huntress", 3, 2),
    new ArcanaCard("", "Eternity", 4, 3),
    new ArcanaCard("", "The Moon", 5, 0),
    new ArcanaCard("", "The Furies", 6, 2),
    new ArcanaCard("", "Persistence", 7, 2),
    new ArcanaCard("", "The Messenger", 8, 1),
    new ArcanaCard("", "The Unseen", 9, 5),
    new ArcanaCard("", "Night", 10, 2)
]

export function sortByRank(a: ArcanaCard, b: ArcanaCard) {
    return a.rank - b.rank
}