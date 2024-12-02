import { Component } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: 'j-fo-doc-page',
  templateUrl: './doc-page.component.html'
})
export class DocPageComponent {

  constructor(
    private activeRoute: ActivatedRoute
  ) {}

  get id() {
    let id = this.activeRoute.snapshot.params["id"]
    return id
  }
  
  get mainPageUrl() {
    return `./assets/doc/${this.id}/index.md`
  }

}