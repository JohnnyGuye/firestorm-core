import { Collection } from "@jiway/firestorm-core";

@Collection({ collection: 'achievements' })
export class Achievement {

    public id: string = ""

    public name: string = ""

    public description: string = ""
    
}