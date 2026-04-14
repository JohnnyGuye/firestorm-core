import { Collection, Ignore } from "@jiway/firestorm-core";

@Model({ collection: 'playgrounds' })
export class Playground {

    @Ignore()
    id: string = ""
    
}