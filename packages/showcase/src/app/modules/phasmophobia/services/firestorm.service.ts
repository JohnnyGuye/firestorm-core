import { Injectable } from "@angular/core";
import { Firestorm } from "@jiway/firestorm-core"
import { default as environment } from "@environment";
import { PhasmoEntity, PhasmoGame } from "../models";
import { GHOST_ENTITIES } from "../models/predefined-entities";

const phasmo = environment.firebases.phasmo

@Injectable({ providedIn: 'root' })
export class FirestormService {

  private firestorm = new Firestorm()

  constructor() {
    this.firestorm.connect(phasmo)
    // this.initPhasmo()
  }

  
  public get entityRepository() {
    return this.firestorm.getCrudRepository(PhasmoEntity)
  }

  public get gameRepository() {
    return this.firestorm.getCrudRepository(PhasmoGame)
  }

  public get randomGameRepository() {
    return this.firestorm.getSingleDocumentCrudRepository(PhasmoGame, "a_random_game")
  }

  private async initPhasmo() {
    await this.entityRepository.deleteAllAsync()
    await this.entityRepository.createMultipleAsync(...GHOST_ENTITIES)
  }
}