import { Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { FirestormService } from "@modules/phasmophobia";
import { GHOST_ENTITIES } from "@modules/phasmophobia/models/predefined-entities";

type RefreshState = 'pristine' | 'refreshed' | 'refreshing'

@Component({
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: 'db-tools.page.html'
})
export class DbtoolsPage {
 
  private firestormService = inject(FirestormService)

  public refreshState: RefreshState = 'pristine'

  async refreshEntities() {
    this.refreshState = 'refreshing'
    await this.firestormService.entityRepository.deleteAllAsync()
    await this.firestormService.entityRepository.createMultipleAsync(...GHOST_ENTITIES)
    this.refreshState = 'refreshed'
  }

  get canRefresh() {
    return this.refreshState == 'pristine'
  }
}