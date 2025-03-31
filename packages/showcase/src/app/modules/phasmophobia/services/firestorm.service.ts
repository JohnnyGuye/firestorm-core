import { Injectable } from "@angular/core";
import { CollectionDocumentTuple, Firestorm } from "@jiway/firestorm-core"
import { default as environment } from "@environment";
import { PhasmoEntity, PhasmoGame } from "../models";
import { GHOST_ENTITIES } from "../models/predefined-entities";
import { CollectionDocumentTuples } from "@jiway/firestorm-core";
import { Playground } from "@modules/playgrounds";

const phasmo = environment.firebaseConfigurations.phasmo

@Injectable({ providedIn: 'root' })
export class FirestormService {

  private firestorm: Firestorm
  private rootCollection = new CollectionDocumentTuples(
    [new CollectionDocumentTuple<any>("playgrounds", "phasmophobia")]
  )

  constructor() {

    this.firestorm = new Firestorm()
    this.firestorm.connect(phasmo)
    
    if (environment.dev.useEmulator) {
      console.info('%cUsing the firestore emulated database.', 'color: purple; background: aquamarine; font-weight: 700; font-size: 2em');
      this.firestorm.useEmulator()
    }

  }

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

  public async refreshEntitiesAsync() {
    await this.entityRepository.deleteAllAsync()
    await this.entityRepository.createMultipleAsync(...GHOST_ENTITIES)
  }
}