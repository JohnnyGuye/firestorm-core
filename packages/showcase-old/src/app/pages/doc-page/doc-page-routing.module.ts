import { NgModule } from "@angular/core";
import { Route, RouterModule, Routes, UrlMatchResult, UrlSegment, UrlSegmentGroup } from "@angular/router";
import { DocPageComponent } from "./doc-page.component";

function docMatcher(segments: UrlSegment[], group: UrlSegmentGroup, route: Route): UrlMatchResult | null {

  if (segments[0].path !== 'doc') return null

  const dfp = `${segments.join("/")}/index.md`
  const result = {
    consumed: segments,
    posParams: {
      docFilePath: new UrlSegment(dfp, {})
    }
  }

  return result
}

const routes: Routes = [
  {
    path: '',
    redirectTo: "overview",
    pathMatch: "full"
  },
  {
    matcher: docMatcher,
    component: DocPageComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocPageRoutingModule {}