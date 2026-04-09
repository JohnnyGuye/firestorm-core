import { Model, FirestormId, Ignore } from "@jiway/firestorm-core";
import { Privilege, UserRole } from "./roles";

@Model({ collection: 'persons' })
export class Person {

    @Ignore()
    id: FirestormId = ""

    name: string = ""

    surname: string = ""

    role: UserRole = 'reader'

    privileges: Privilege[] = []

    age: number = 25

    get isAdult() {
        return this.age >= 21
    }
    
}