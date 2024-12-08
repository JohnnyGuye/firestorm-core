import { inject } from "@angular/core";
import { FirestormService } from "@modules/phasmophobia";

export class PlaygroundSection {

  protected firestormService = inject(FirestormService)

  protected get entityRepository() { return this.firestormService.entityRepository }

  protected get gameRepository() { return this.firestormService.gameRepository }

}