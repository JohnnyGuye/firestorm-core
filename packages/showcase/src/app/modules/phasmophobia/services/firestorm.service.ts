import { Injectable } from "@angular/core";
import { Firestorm } from "@jiway/firestorm-core"
import { default as environment } from "@environment";
import { PhasmoEntity } from "../models";

const phasmo = environment.firebases.phasmo

@Injectable({ providedIn: 'root' })
export class FirestormService {

  private firestorm = new Firestorm()

  constructor() {
    this.firestorm.connect(phasmo)
  }

  public get entityRepository() {
    return this.firestorm.getCrudRepository(PhasmoEntity)
  }
}