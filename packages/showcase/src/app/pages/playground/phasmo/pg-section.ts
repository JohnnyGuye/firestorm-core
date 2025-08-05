import { inject } from "@angular/core";
import { PhasmoOrmService } from "@modules/phasmophobia";

export class PlaygroundSection {

  protected firestormService = inject(PhasmoOrmService)

  protected get entityRepository() { return this.firestormService.entityRepository }

  protected get gameRepository() { return this.firestormService.gameRepository }

}