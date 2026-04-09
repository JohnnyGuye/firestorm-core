import { Model, FirestormId, Ignore, ToSubCollection } from "@jiway/firestorm-core";
import { UserAchievement } from "./user-achievement";

@Model({ collection: 'users' })
export class User {
    
    /**
     * Id of the user
    */
   public id: string = ""
   
    /**
    * Nickname
    */
    public nickname: string = ""
  
    /**
     * Achievements of the user
     */
    @Ignore()
    @ToSubCollection({ targetTypeForwardRef: () => UserAchievement  })
    public achievements = new Map<FirestormId, UserAchievement>()
 
}

