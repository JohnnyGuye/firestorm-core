import { Injectable } from "@angular/core";
import { Firestorm } from "@jiway/firestorm-core"
import { default as environment } from "@environment";
import { Achievement, PhasmoEntity, PhasmoGame, User, UserAchievement } from "../models";
import { GHOST_ENTITIES, ACHIEVEMENTS } from "../initial-data";
import { generateInt, generateName, getRandomInArray } from "@modules/random";

const phasmo = environment.firebaseConfigurations.phasmo

@Injectable({ providedIn: 'root' })
export class PhasmoOrmService {

  private firestorm: Firestorm
  private rootCollection = ["playgrounds", "phasmophobia"]

  constructor() {

    this.firestorm = new Firestorm()
    this.firestorm.connect(phasmo)
    
    this.init()

    if (environment.dev.useEmulator) {
      console.info('%cUsing the firestore emulated database.', 'color: purple; background: aquamarine; font-weight: 700; font-size: 2em');
      this.firestorm.useEmulator()
    }

  }

  private init() {}

  /**
   * Gets the repository containing the entities
   */
  public get entityRepository() {    
    return this.firestorm.getCrudRepository(PhasmoEntity, this.rootCollection)
  }

  /**
   * Gets the repository containing games
   */
  public get gameRepository() {
    return this.firestorm.getCrudRepository(PhasmoGame, this.rootCollection)
  }

  /**
   * Gets the repository on the random game specifically made for the listener
   */
  public get randomGameRepository() {
    return this.firestorm.getSingleDocumentCrudRepository(PhasmoGame, "a_random_game", this.rootCollection)
  }

  public get achievementsRepository() {
    return this.firestorm.getCrudRepository(Achievement, this.rootCollection)
  }

  public get usersRepository() {
    return this.firestorm.getCrudRepository(User, this.rootCollection)
  }

  public async initDatas() {

    await this.initStaticDatasAsync()

  }

  private async initStaticDatasAsync() {
    
    await this.achievementsRepository.deleteAllAsync()
    await this.achievementsRepository.createMultipleAsync(...ACHIEVEMENTS)
    
    await this.refreshEntitiesAsync()
    await this.generateBasicUsersAsync()
    
  }

  private async refreshEntitiesAsync() {
    await this.entityRepository.deleteAllAsync()
    await this.entityRepository.createMultipleAsync(...GHOST_ENTITIES)
  }

  private async generateBasicUsersAsync() {

    this.usersRepository.deleteAllAsync()

    const achievements = await this.achievementsRepository.getAllAsync()

    const userCount = 3
    const users: User[] = []
    for (let i = 0; i < userCount; i++) {
      
      const user = this.generateRandomUser()
      users.push(user)
      
    }

    await this.usersRepository.createMultipleAsync(...users)

    for (let user of users) {

      const aCount = generateInt(3) + 2

      const uas = []

      for (let i = 0; i < aCount; i++) {
        
        const ua = this.generateRandomUserAchievements(user, achievements)
        uas.push(ua)

      }

      const achievementCrud = 
        this.firestorm
          .getCrudRepository(
            UserAchievement, 
            ["users", user.id]
          )

      await achievementCrud.createMultipleAsync(...uas)

    }

  }

  private generateRandomUser() {

    const user = new User()
    user.nickname = generateName()

    return user
  }

  private generateRandomUserAchievements(user: User, achievements: Achievement[]) {

    const achUser = new UserAchievement()
    achUser.achievementId.setModel(getRandomInArray(achievements))
    achUser.acquisitionDate = new Date()
    achUser.userId = user.id

    return achUser
  }

}
