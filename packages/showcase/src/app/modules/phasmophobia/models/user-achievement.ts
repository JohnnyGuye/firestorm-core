import { Collection, DateType, Ignore, ToOne, ToOneRelationship } from "@jiway/firestorm-core"
import { Achievement } from "./_internal"

console.log("Read user-a")

@Collection({ collection: 'achievements' })
export class UserAchievement {

    @Ignore()
    public id: string = ""

    @DateType()
    public acquisitionDate: string = ""

    // @ToOne({ target: User, location: 'root' })
    public userId: string = ""

    @ToOne({ target: Achievement, location: 'root' })
    public achievementId = new ToOneRelationship(Achievement)
    
}