import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";

import { DocPageComponent } from "./doc-page.component";
import { DocPageRoutingModule } from "./doc-page-routing.module";

import { MarkdownModule } from "ngx-markdown"

@NgModule({
  declarations: [
    DocPageComponent
  ],
  imports: [
    CommonModule,
    DocPageRoutingModule,
    MarkdownModule.forChild(),
  ]
})
export class DocPageModule {}