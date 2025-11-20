import { Collection, FirestormId, Ignore } from "@jiway/firestorm-core";
import { Privilege, UserRole } from "./roles";

@Collection({ collection: 'persons' })
export class Person {

    @Ignore()
    id: FirestormId = ""

    name: string = ""

    surname: string = ""

    role: UserRole = 'reader'

    privileges: Privilege[] = []
    
}