import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PlaygroundSectionComponent } from '@components/playground-section';
import { PlaygroundModelMarkdownComponent } from "../../../../components/playground-model-markdown/playground-model-markdown.component";
import { PhasmoGame } from '@modules/phasmophobia/models';
import { PlaygroundSection } from '../pg-section';

@Component({
  selector: 'firestorm-pg-section-find-include',
  imports: [
    PlaygroundSectionComponent,
    MatButtonModule,
    PlaygroundModelMarkdownComponent
],
  template: `
<firestorm-playground-section [title]="'Include'">

  <button description mat-flat-button (click)="find()">
    <span>Find and include</span>
  </button>

  <p description>
    The button will fetch the current random game and tilt include the model for the entity
  </p>

  <firestorm-playground-model-markdown result [data]="game" [repo]="gameRepository"></firestorm-playground-model-markdown>

</firestorm-playground-section>
  `,
  styleUrl: './pg-section-find-include.component.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class PgSectionFindIncludeComponent extends PlaygroundSection { 

  private get randomGameRepository() {
    return this.firestormService.randomGameRepository
  }

  game: PhasmoGame | null = null

  async find() {
    const id = this.randomGameRepository.documentId
    const game = await this.gameRepository.findByIdAsync(id, { ghostEntity: true })
    console.log(game)
    this.game = game
  }

}
