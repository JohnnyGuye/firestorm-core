import { Component, inject } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { PhasmoOrmService } from "@modules/phasmophobia";


type RefreshState = 'pristine' | 'refreshed' | 'refreshing'

@Component({
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: 'db-tools.page.html'
})
export class DbtoolsPage {
 
  private phasmoOrmService = inject(PhasmoOrmService)

  public refreshState: RefreshState = 'pristine'

  async refreshStaticDatas() {
    this.refreshState = 'refreshing'

    await this.phasmoOrmService.initStaticDatas()

    this.refreshState = 'refreshed'
  }


  get canRefresh() {
    return this.refreshState == 'pristine'
  }
}