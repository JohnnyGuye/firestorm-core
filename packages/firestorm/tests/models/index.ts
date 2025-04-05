import { Collection, DateType, IFirestormModel, Ignore } from "../../src";

@Collection({ collection: "conversations" })
export class Conversation implements IFirestormModel {

    id: string = ""

    name: string = ""

    participants: string[] = []

    @Ignore()
    get participantCount() {
        return this.participants.length
    }

    @DateType()
    createdOn: Date = new Date()
    
}

@Collection({ collection: "people" })
export class Person implements IFirestormModel {

    id: string = ""

    name: string = ""

}