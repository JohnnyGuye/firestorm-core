import { Injectable } from "@angular/core";
import { CollectionDocumentTuple, Firestorm } from "@jiway/firestorm-core"
import { default as environment } from "@environment";
import { PhasmoEntity, PhasmoGame } from "../models";
import { GHOST_ENTITIES } from "../models/predefined-entities";
import { CollectionDocumentTuples } from "@jiway/firestorm-core";

const phasmo = environment.firebases.phasmo

@Injectable({ providedIn: 'root' })
export class FirestormService {

  private firestorm = new Firestorm()
  private rootCol = new CollectionDocumentTuples([new CollectionDocumentTuple<any>("playgrounds", "phasmophobia")])

  constructor() {
    this.firestorm.connect(phasmo)
    // this.initPhasmo()
  }

  
  public get entityRepository() {
    return this.firestorm.getCrudRepository(PhasmoEntity, this.rootCol)
  }

  public get gameRepository() {
    return this.firestorm.getCrudRepository(PhasmoGame, this.rootCol)
  }

  public get randomGameRepository() {
    return this.firestorm.getSingleDocumentCrudRepository(PhasmoGame, "a_random_game")
  }

  private async initPhasmo() {
    await this.entityRepository.deleteAllAsync()
    await this.entityRepository.createMultipleAsync(...GHOST_ENTITIES)
  }
}