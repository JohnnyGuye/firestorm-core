import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuSection } from './components/main-menu/main-menu.component';
import { DevTestComponent } from './modules/playground/pages/dev-test/dev-test.component';
import { PlaygroundModule } from './modules/playground/playground.module';
import { CoreConceptsComponent } from './pages/core-concepts/core-concepts.component';

const routes: Routes = [
  {
    path: 'comprehensive-documentation',
    children: [
      {
        path: 'core-concepts',
        component: CoreConceptsComponent
      }
    ]
  },
  {
    path: '',
    redirectTo: 'dev-test',
    pathMatch: 'full'
  },
  {
    path: 'dev-test',
    component: DevTestComponent
  }
];


export const MENU: MenuSection[] = [
  {
    title: "Getting started",
    children: [
      {
        title: "Core concepts",
        path: "comprehensive-documentation/core-concepts"
      }
    ]
  }
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    PlaygroundModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
