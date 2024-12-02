import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MetadataStoragePageRoutingModule } from './metadata-storage-page-routing.module';
import { MetadataStoragePageComponent } from './metadata-storage-page.component';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
  declarations: [
    MetadataStoragePageComponent
  ],
  imports: [
    CommonModule,
    MarkdownModule,
    MetadataStoragePageRoutingModule
  ]
})
export class MetadataStoragePageModule { }
