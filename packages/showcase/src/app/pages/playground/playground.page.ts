import { Component, inject } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { FirestormService } from "@modules/phasmophobia";
import { PhasmoEntity, PhasmoGame } from "@modules/phasmophobia/models";
import { MarkdownModule } from "ngx-markdown";
import { PlaygroundModelMarkdownComponent } from "@components/playground-model-markdown";
import { PlaygroundSectionComponent } from "@components/playground-section";
import { ExplicitAggregationQuery, Query } from "@jiway/firestorm-core";
import { PlaygroundPlainObjectMarkdownComponent } from "../../components/playground-plain-object-markdown/playground-plain-object-markdown.component";
import { MatExpansionModule } from "@angular/material/expansion";

@Component({
  standalone: true,
  templateUrl: 'playground.page.html',
  imports: [
    MatButtonModule,
    MarkdownModule,
    PlaygroundSectionComponent,
    PlaygroundModelMarkdownComponent,
    PlaygroundPlainObjectMarkdownComponent,
    MatExpansionModule
]
})
export class PlaygroundPage {

  private firestormSrv = inject(FirestormService)

  constructor() {}

  protected get entityRepo() {
    return this.firestormSrv.entityRepository
  }

  public ghostBluePrint = this.entityRepo.documentBlueprint
  public retrievedEntities: PhasmoEntity[] = []

  public aggregatedEntities: any = {}
  public aggregatedStandardSpeedEntities: any = {}

  public async retrieveEntities() {
    
    const entities = await this.firestormSrv.entityRepository.findAllAsync()
    this.retrievedEntities = entities

  }

  public async aggregateEntities() {
    this.aggregatedEntities = await this.firestormSrv.entityRepository
      .aggregateAsync(
      {
        entityCount: {
          verb: "count"
        },
        averageBaseSpeed: {
          verb: 'average',
          field: 'base_speed'
        }
      }
    )
  }

  public async aggregateStandardSpeedEntities() {

    const aggSpec: ExplicitAggregationQuery = { entityCount: { verb: "count" } }
    const query = new Query().where('base_speed', '==', 1.7)

    this.aggregatedStandardSpeedEntities = await this.firestormSrv.entityRepository
      .aggregateAsync(aggSpec, query)
  }

  public async startListeningToRandomGameChanges() {

    const entities = await this.entityRepo.findAllAsync()

    const it = setInterval(() => {
      const entityId = entities[Math.floor(Math.random() * entities.length)].id
      const game = new PhasmoGame()
      game.ghostEntity = entityId
      this.firestormSrv.randomGameRepository.writeAsync(game)
    }, 500)
    
    const listener = this.firestormSrv.gameRepository.listen(this.firestormSrv.randomGameRepository.documentId)
    const subscription = listener.subscribe({
      next: console.log,
      error: console.error,
      complete: console.warn
    })
    setTimeout(() => {
      clearInterval(it)
      subscription.unsubscribe()
      console.log("Listening stoped")
    }, 4000)

    console.log("Listening started")
  }

  ghostEntityModelSnippet = 

`
import { Collection } from "@jiway/firestorm-core";

export const EVIDENCES = ['ghost_orb', 'emf_5', 'freezing', 'uv', 'writing', 'dots', 'spirit_box'] as const
export type Evidences = typeof EVIDENCES[number]

/**
 * Represents the blueprint for a ghost entity in phasmophobia
 */
@Collection({ collection: 'playgrounds/phasmophobia/entities' })
export class PhasmoEntity {

  /**
   * Id of the entity
   */
  id: string = ""

  /**
   * Name of the entity
   */
  name: string = ""

  /**
   * Evidences the entity provides as its signature
   */
  evidences: Evidences[] = []

  /**
   * Base speed of the entity (in m/s)
   */
  baseSpeed: number = 1.7
  
}
`


  retrieveSnippet = 
`const entities 
  = await entityRepository
    .findAllAsync()
`

  aggregateSnippet =
`
const aggregationQuery: ExplicitAggregationQuery 
  = {
      entityCount: { verb: "count" },
      averageBaseSpeed: { verb: 'average', field: 'base_speed' }
    }
const aggregation 
  = await entityRepository
    .aggregateAsync(aggregationQuery)
`

  aggregateWithQuerySnippet = 
`
const aggregationQuery: ExplicitAggregationQuery = { entityCount: { verb: "count" } }
const query = new Query().where('base_speed', '==', 1.7)

const aggregation 
  = await entityRepository
    .aggregateAsync(aggregationQuery, query)
`
}