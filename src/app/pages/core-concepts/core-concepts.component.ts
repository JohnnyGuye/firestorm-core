import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseOptions } from 'firebase/app';
import { Firestorm } from 'src/firestorm';
import { City, Street } from 'src/app/models/cities';
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

    
    this.doTheThings()
    
  }
  
  async doTheThings() {
    
    const firestorm = new Firestorm('doc-base')
    firestorm.connect(defaultOptions)
    
    // let repository: Repository<City> = firestorm.getRepository(City)
    
    // await repository.create(new City())
    // const cities = await repository.findAll()
    // const city = new City()
    // city.name = "Los Angeles"
    // city.state = "CA"
    // city.country = "USA"
    // await repository.create(city)
    // city.country = "Spain"
    // await repository.update(city)

    // // for (let city of cities) {
    // //   console.log(city)
    // //   await repository.delete(city)
    // // }
    // // await repository.delete("fezfezouihferah")
    // console.log(await repository.findAll())
  
    const c = new City()
    c.id = "COj04ISsVRkXsgIoElK0"
    let subRepo = firestorm.getSubRepository(
      Street, 
      { type: City, instance: c, key: 'streets' }
      )
    console.log(subRepo.collectionPath)
    // console.log(repository.typeMetadata)
    
  }
}
