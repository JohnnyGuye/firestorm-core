import { Injectable } from '@angular/core';
import { FirebaseOptions } from 'firebase/app';
import { Firestorm } from '@firestorm';

interface IFirestormConnector {
  name: string
  options: FirebaseOptions
}

class FirestormConnector implements IFirestormConnector {
  
  public name: string
  public options: FirebaseOptions

  public constructor(connector: IFirestormConnector);
  public constructor(name: string, options: FirebaseOptions);
  public constructor(nameOrConnector: IFirestormConnector | string, options?: FirebaseOptions) {
    if (typeof nameOrConnector === "string") {
      this.name = nameOrConnector
      if (options == undefined) throw Error("You must specify options with the name")
      this.options = options
    } else {
      this.name = nameOrConnector.name
      this.options = nameOrConnector.options
    }

  }
}

@Injectable({
  providedIn: 'root'
})
export class PlaygroundService {

  private static readonly STORAGE_LOCATION: string = "playground/firestorm-connectors"

  private firestormInstances: Firestorm[] = []
  private _lastInstance: Firestorm | null = null
  private _connectors: IFirestormConnector[] = []

  constructor() {
    this.load()
  }

  private load() {

    const loadedItems = localStorage.getItem(PlaygroundService.STORAGE_LOCATION)
    if (!loadedItems || loadedItems == "null") return
    
    const connectors = JSON.parse(loadedItems) as IFirestormConnector[]
    this._connectors.length = 0
    connectors.forEach(connector => {
      this.addConnector(connector)
    })

  }

  private save() {
    const connectors: IFirestormConnector[] = []
    
    for (let connector of this.connectors) {
      connectors.push(connector)
    }

    for (let instance of this.instances) {
      if (!instance || !instance.options) continue
      let connector = { 
        name: instance.name,
        options: instance.options
      }
      connectors.push(connector)
    }
    const jsonString = JSON.stringify(connectors)
    localStorage.setItem(PlaygroundService.STORAGE_LOCATION, jsonString)
  }

  get connectors() {
    return [...this._connectors]
  }

  get instances() {
    return [...this.firestormInstances]
  }

  get lastInstance() {
    return this._lastInstance
  }

  getInstanceByName(name: string | Firestorm | IFirestormConnector) {
    if (typeof name !== "string") name = name.name
    return this.instances.find(value => value.name == name)
  }

  addConnector(connector: IFirestormConnector) {
    const prevIdx = this._connectors.findIndex(value => value.name === connector.name)
    if (prevIdx >= 0) this._connectors.splice(prevIdx, 1)
    this._connectors.push(Object.assign({},connector))
  }

  register(firestorm: Firestorm) {

    const prevInstance = this.getInstanceByName(firestorm)

    let registeredInstance: Firestorm
    
    if (!prevInstance) {
      this.firestormInstances.push(firestorm)
      registeredInstance = firestorm
    } else if (prevInstance == firestorm) {
      registeredInstance = firestorm
    } else {
      console.warn("Do something about re registering a firestorm instance")
      registeredInstance = prevInstance
    }
    if (firestorm.options && firestorm.name) {
      this.addConnector(new FirestormConnector(firestorm.name, firestorm.options))
      this.save()
    }
    return registeredInstance

  }
  
}
