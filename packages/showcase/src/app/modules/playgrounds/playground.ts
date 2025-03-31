import { Collection, Ignore } from "@jiway/firestorm-core";

@Collection({ collection: 'playgrounds' })
export class Playground {

    @Ignore()
    id: string = ""
    
}