import { Collection, SubCollection } from "@jiway/firestorm-core";
import { UserAchievement } from "./user-achievement";

console.log("Read user")
@Collection({ collection: 'users' })
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
    @SubCollection({ collection: 'achievements', forwardRef: () => UserAchievement  })
    public achievements: UserAchievement[] = []
 
}

