import { Component } from '@angular/core';
import { FirestormService } from 'src/app/services/firestorm.service';

@Component({
  selector: 'app-metadata-storage-page',
  templateUrl: './metadata-storage-page.component.html',
  styleUrls: ['./metadata-storage-page.component.css']
})
export class MetadataStoragePageComponent {

  constructor(private firestormSrv: FirestormService) {}

  get flattenedData() {
    console.log(this.firestormSrv.flattenedData)
    return this.firestormSrv.flattenedData
  }

}
