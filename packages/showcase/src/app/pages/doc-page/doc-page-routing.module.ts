import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DocPageComponent } from "./doc-page.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: "overview",
    pathMatch: "full"
  },
  {
    path: ":id",
    component: DocPageComponent
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocPageRoutingModule {}