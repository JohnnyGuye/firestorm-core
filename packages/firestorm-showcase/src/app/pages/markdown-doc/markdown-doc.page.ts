import { Component, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";

import { MarkdownComponent } from "ngx-markdown"

@Component({
  standalone: true,
  templateUrl: 'markdown-doc.page.html',
  imports: [
    MarkdownComponent
  ]
})
export class MarkdownDocPage {

  private activatedRoute = inject(ActivatedRoute)

  get id() {
    const id = this.activatedRoute.snapshot.params['id']
    return id
  }

  get docFileUrl() {
    return `/doc/${this.id}/index.md`
  }

}