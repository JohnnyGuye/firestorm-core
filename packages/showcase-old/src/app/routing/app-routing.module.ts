import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; // CLI imports router

const routes: Routes = [
  {
    path: '',
    redirectTo: "doc",
    pathMatch: "full"
  },
  {
    path: "metadata-storage",
    loadChildren: () => import('../pages/metadata-storage-page').then(m => m.MetadataStoragePageModule)
  },
  {
    path: 'doc',
    loadChildren: () => import('../pages/doc-page').then(m => m.DocPageModule)
  },
]; // sets up routes constant where you define your routes

// configures NgModule imports and exports
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }