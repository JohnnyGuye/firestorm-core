import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatSidenavModule } from "@angular/material/sidenav"
import { MatToolbarModule } from "@angular/material/toolbar"
import { MatIconModule } from "@angular/material/icon"

import { MatButtonModule } from "@angular/material/button"

import { AppComponent } from './app.component';
import { AppRoutingModule } from './routing/app-routing.module';
import { FirestormVersionBadgeComponent } from './components/firestorm-version-badge.component';
import { SidebarNavigationComponent } from './modules/navigation/sidebar-navigation/sidebar-navigation.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MarkdownModule } from 'ngx-markdown';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    FirestormVersionBadgeComponent,
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MarkdownModule.forRoot({ loader: HttpClient}),
    SidebarNavigationComponent,
    MatButtonModule,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
