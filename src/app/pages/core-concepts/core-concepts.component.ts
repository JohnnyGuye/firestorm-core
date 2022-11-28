import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseOptions } from 'firebase/app';
import { Firestorm } from 'src/firestorm';
import { City } from 'src/app/models/cities';
import { Repository } from 'src/firestorm/core/repository';
import { environment } from 'src/app/environment/environment';

const defaultOptions: FirebaseOptions = environment.firestorm

@Component({
  selector: 'fo-core-concepts',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './core-concepts.component.html',
  styleUrls: ['./core-concepts.component.scss']
})
export class CoreConceptsComponent {


  constructor() {

    const firestorm = new Firestorm('doc-base')
    firestorm.connect(defaultOptions)
    
    let repository: Repository<City> = firestorm.getRepository(City)
    repository.findAll().then(res => console.log(res))

    let subRepo = firestorm.getSubRepository(City, { parent: new City(), key: 'streets' })
    console.log(repository.typeMetadata)

  }
}
