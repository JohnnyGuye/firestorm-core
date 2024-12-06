import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from "@angular/material/button-toggle"
import { BaseRepository, FirestormModel } from '@jiway/firestorm-core';
import { MarkdownModule } from 'ngx-markdown';

type DisplayOption = 'document' | 'model'

@Component({
  selector: 'firestorm-playground-model-markdown',
  imports: [
    MarkdownModule,
    MatButtonModule,
    MatButtonToggleModule
  ],
  template: `
   <mat-button-toggle-group name="fontStyle" aria-label="Font Style" [(value)]="showAs" hideSingleSelectionIndicator >
    <mat-button-toggle value="document">Document</mat-button-toggle>
    <mat-button-toggle value="model">Model</mat-button-toggle>
  </mat-button-toggle-group>
  <markdown [data]="json | language:'js' "></markdown>
  `,
  styleUrl: './playground-model-markdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundModelMarkdownComponent<T extends FirestormModel> { 

  private _datas: T[] = []
  private _showAs: DisplayOption = 'document'

  @Input()
  set datas(value: T[]) {
    this._datas = value
    this.refreshJson()
  }

  get datas() {
    return this._datas
  }

  @Input()
  repo?: BaseRepository<T>

  public set showAs(value: DisplayOption) {
    this._showAs = value
    this.refreshJson()
  }

  public get showAs() {
    return this._showAs
  }

  protected json: string = ""

  public switch() {
    this._showAs = this._showAs == 'document' ? 'model' : 'document'
  }

  private refreshJson() {
    if (!this.repo) return 
    
    switch (this._showAs) {
      case 'document':
        const docs = this.repo.modelsToDocuments(this.datas)
        this.json = JSON.stringify(docs, undefined, 2)
        break;
      case 'model':
        const models = this.datas
        this.json = JSON.stringify(models, undefined, 2)
        break;
    }
  }

}