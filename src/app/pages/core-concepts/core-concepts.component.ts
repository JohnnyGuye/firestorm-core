import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseOptions } from 'firebase/app';
import { environment } from 'app/environment/environment';
import { City, Street } from 'app/models/cities';
import { Repository } from '@firestorm/repository';
import { Query } from '@firestorm/query';
import { Firestorm } from '@firestorm';


const defaultOptions: FirebaseOptions = environment.firestorm

class CityRepository extends Repository<City> {

  public async findByName(name: string) {
    const cities = await this.query(new Query().where("name", "==", name))
    return cities
  }

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
  
    firestorm.registerCustomRepository(City, CityRepository)
    firestorm.registerCustomRepository(Street, CityRepository)
    const c = new City()
    c.id = "COj04ISsVRkXsgIoElK0"

    const repo = firestorm.getRepository(City) as CityRepository
    const losAngeless = await repo.findByName("Los Angeles")
    console.log(repo, losAngeless)
    
    let subRepo = firestorm.getRepository(
      Street, 
      { type: City, instance: c, key: 'streets' }
      )

    subRepo.create(new Street())
    console.log(City)
    
    console.log(subRepo.collectionPath)
    // const repo = firestorm.getRepository(City)
    // where("country", "in", ["Spain", "France"])
    const query = new Query()
    query.where("country", 'in', ["Spain", "France"])
      
    // query.validityCheck(City)

    // const res = await repo.query(query)
    // console.log(res)
    // console.log(repository.typeMetadata)
    
  }
}
