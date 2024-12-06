import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { MarkdownModule } from 'ngx-markdown';

@Component({
  selector: 'firestorm-playground-plain-object-markdown',
  imports: [
    MarkdownModule
  ],
  template: `<markdown [data]="json | language:'js' "></markdown>`,
  styleUrl: './playground-plain-object-markdown.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaygroundPlainObjectMarkdownComponent { 

  private _data: NonNullable<any> = {}

  @Input()
  set data(value: NonNullable<any>) {
    this._data = value
    this.refreshJson()
  }

  get data() {
    return this._data
  }

  protected json: string = ""

  refreshJson() {
    this.json = JSON.stringify(this.data, undefined, 2)
  }


}
