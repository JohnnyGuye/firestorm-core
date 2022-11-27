import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseOptions } from 'firebase/app';
import { Firestorm } from 'src/firestorm';
import { City } from 'src/app/models/cities';
import { Repository } from 'src/firestorm/core/repository';

const defaultOptions: FirebaseOptions = {
  apiKey: "AIzaSyCd1yRM3wXFkCxIDBb49fNtfcU81CujaJQ",
  authDomain: "firestorm-base-1.firebaseapp.com",
  projectId: "firestorm-base-1",
  storageBucket: "firestorm-base-1.appspot.com",
  messagingSenderId: "768540809890",
  appId: "1:768540809890:web:7857611210fa8fa3fbd5fb"
}

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
    
    let repository: Repository<City> = firestorm.getRepositoryInstance(City)
    console.log(repository.typeMetadata)
    repository.findAll().then(res => console.log(res))

  }
}
