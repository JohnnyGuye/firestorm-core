import { Model } from "@jiway/firestorm-core";

@Model({ collection: 'achievements' })
export class Achievement {

    public id: string = ""

    public name: string = ""

    public description: string = ""
    
}