import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PlaygroundPlainObjectMarkdownComponent } from '@components/playground-plain-object-markdown';
import { PlaygroundSectionComponent } from '@components/playground-section';
import { PlaygroundSection } from '../pg-section';
import { ExplicitAggregationQuery, Query } from '@jiway/firestorm-core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'firestorm-pg-section-aggregate-query',
  imports: [
    PlaygroundSectionComponent,
    PlaygroundPlainObjectMarkdownComponent,
    MatButtonModule
  ],
  template: `
      <firestorm-playground-section [title]="'Aggregate collection with query'" [snippet]="snippet">
        
        <p description>
          This how you make aggregation queries on collections restricted by a query.
        </p>

        <button description mat-stroked-button (click)="aggregateStandardSpeedEntities()">
          Count standard speed entities
        </button>
  
        <firestorm-playground-plain-object-markdown result [data]="aggregatedStandardSpeedEntities"></firestorm-playground-plain-object-markdown>
  
      </firestorm-playground-section>
  
  `,
  styleUrl: './pg-section-aggregate-query.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PgSectionAggregateQueryComponent extends PlaygroundSection { 

  snippet = 
`
const aggregationQuery: ExplicitAggregationQuery = { entityCount: { verb: "count" } }
const query = new Query().where('base_speed', '==', 1.7)

const aggregation 
  = await entityRepository
    .aggregateAsync(aggregationQuery, query)
`

  public aggregatedStandardSpeedEntities: any = {}

  public async aggregateStandardSpeedEntities() {

    const aggSpec: ExplicitAggregationQuery = { entityCount: { verb: "count" } }
    const query = new Query().where('base_speed', '==', 1.7)

    this.aggregatedStandardSpeedEntities = await this.entityRepository.aggregateAsync(aggSpec, query)
  }

}
