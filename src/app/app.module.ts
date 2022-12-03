import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DrawerComponent } from './components/drawer/drawer.component';
import { FooterComponent } from './components/footer';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { HighlightCodeDirective } from './directives/highlight-code/highlight-code.directive';



@NgModule({
  declarations: [
    AppComponent,
    HighlightCodeDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DrawerComponent,
    MainMenuComponent,
    FooterComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
