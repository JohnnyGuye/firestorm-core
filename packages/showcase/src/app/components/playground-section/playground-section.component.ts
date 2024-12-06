import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';
import { MatExpansionModule } from "@angular/material/expansion"

@Component({
  selector: 'firestorm-playground-section',
  imports: [
    MarkdownModule,
    MatExpansionModule
  ],
  template: `
  <mat-expansion-panel>
    <mat-expansion-panel-header>
      <mat-panel-title>{{title}}</mat-panel-title>
    </mat-expansion-panel-header>

    <div class="row">
      <div class="col s12">
        <ng-content select="[description]"></ng-content>
      </div>
    </div>
    <div class="row">
      <div class="col s6">
        <div class="section-title">Code snippet</div>
        <markdown lineNumbers [data]="snippet | language:'typescript' "></markdown>
      </div>
      <div class="col s6">
        <div class="section-title">Result</div>
        <ng-content select="[result]"></ng-content>
      </div>
    </div>
  </mat-expansion-panel>
  `,
  styleUrl: './playground-section.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundSectionComponent { 

  @Input()
  title: string = ""

  @Input()
  snippet: string = ""

}
