import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MetadataStoragePageComponent } from './metadata-storage-page.component';

const routes: Routes = [
  {
    path: "",
    component: MetadataStoragePageComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MetadataStoragePageRoutingModule { }
