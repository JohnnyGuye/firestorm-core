import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { PlaygroundPlainObjectMarkdownComponent } from '@components/playground-plain-object-markdown';
import { PlaygroundSectionComponent } from '@components/playground-section';
import { PlaygroundSection } from '../pg-section';
import { PhasmoEntity, PhasmoGame } from '@modules/phasmophobia/models';
import { DocumentListenerEvent } from '@jiway/firestorm-core';

@Component({
  standalone: true,
  selector: 'firestorm-pg-section-document-listener',
  imports: [
    PlaygroundSectionComponent,
    PlaygroundPlainObjectMarkdownComponent,
    MatButtonModule
  ],
  template: `
<firestorm-playground-section [title]="'Document change listener'">

  <button description mat-flat-button 
  [disabled]="!canStartListening" 
  (click)="startListeningToRandomGameChanges()">
  @if (canStartListening) {
    <span>Listen</span>
  } @else {
    <span>Listening...</span>
  }
  </button>

  <p description>
    The button will generate two new games per second and listen to this randomized game in parallel for the next 4 seconds. <br/>
    Check the console to see it in action.
  </p>

  <p result>
    Change count: {{changeCount}}
  </p>

  <firestorm-playground-plain-object-markdown result [data]="snapshots"></firestorm-playground-plain-object-markdown>

</firestorm-playground-section>
  `,
  styleUrl: './pg-section-document-listener.component.css',
  changeDetection: ChangeDetectionStrategy.Default
})
export class PgSectionDocumentListenerComponent extends PlaygroundSection {

  private get randomGameRepository() {
    return this.firestormService.randomGameRepository
  }

  constructor() {
    super()
    this.entityRepository
      .findAllAsync()
      .then(entities => this.entities = entities)
  }

  private entities: PhasmoEntity[] = []
  private _interval: any = undefined
  private _snapshots: DocumentListenerEvent<PhasmoGame>[] = []

  get snapshots() {
    return this._snapshots.map(value => {
      return value.document
    })
  }

  get changeCount() {
    return this._snapshots.length
  }

  get alreadyRunning() {
    return !!this._interval
  }

  get canStartListening() {
    return this.entities.length > 0 && !this.alreadyRunning
  }

  public async startListeningToRandomGameChanges() {

    const listener = this.gameRepository
      .listen(this.randomGameRepository.documentId)

    const subscription = listener.subscribe({
      next: (snapshot) => {
        this._snapshots.push(snapshot)
        this._snapshots = [...this._snapshots]
        console.log(snapshot)
      },
      error: console.error,
      complete: console.warn
    })
    
    await this.startMakingChanges()

    setTimeout(() => {
      
      this.stopMakingChanges()

      subscription.unsubscribe()
      console.log("Listening stoped")

    }, 4000)
    
    console.log("Listening started")
  }
  
  private changeRandomGame() {

    const entities = this.entities
    const entity = entities[Math.floor(Math.random() * entities.length)]
    
    const game = new PhasmoGame()
    game.ghostEntity.id = entity.id
    this.randomGameRepository.writeAsync(game)

  }

  private async startMakingChanges() {
    
    if (!this.canStartListening) return

    this._interval = setInterval(() => {
      this.changeRandomGame()
    }, 500)

  }

  private async stopMakingChanges() {
    clearInterval(this._interval)
    this._interval = undefined
  }
}
