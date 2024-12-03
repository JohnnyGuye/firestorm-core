import { Injectable } from '@angular/core';
import { Firestorm, firestormMetadatasToJson } from "@jiway/firestorm-core"
import { Instrument } from './database/instruments';
import { Musician } from './database/musician';

@Injectable({
  providedIn: 'root'
})
export class FirestormService {

  private firestorm = new Firestorm("")


  constructor() {

  }

  get flattenedData() {
    return firestormMetadatasToJson()
  }
  
  
  get instrumentRepository() {
    return this.firestorm.getCrudRepository(Instrument)
  }

  get musicianRepository() {
    return this.firestorm.getCrudRepository(Musician)
  }

}
