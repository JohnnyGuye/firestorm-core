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
import { PgSectionAggregateQueryComponent } from "./phasmo/pg-section-aggregate-query/pg-section-aggregate-query.component";
import { PgSectionDocumentListenerComponent } from "./phasmo/pg-section-document-listener/pg-section-document-listener.component";

@Component({
  standalone: true,
  templateUrl: 'playground.page.html',
  imports: [
    MatButtonModule,
    MarkdownModule,
    PlaygroundSectionComponent,
    PlaygroundModelMarkdownComponent,
    PlaygroundPlainObjectMarkdownComponent,
    MatExpansionModule,
    PgSectionAggregateQueryComponent,
    PgSectionDocumentListenerComponent
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

}