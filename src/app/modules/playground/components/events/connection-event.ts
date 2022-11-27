import { FirebaseOptions } from "firebase/app";
import { Firestorm } from "src/firestorm";

export class FirestormConnectionEvent {

    constructor(
      public readonly firestorm: Firestorm, 
      public readonly options: FirebaseOptions
      ) {}
      
}