import { ISubcollection } from "src/firestorm/core/firestorm-model"
import { Collection, DateType, Ignore, MapTo, SubCollection } from "src/firestorm/decorators"

export class Street {

  id: string | null = null

  name: string | null = null

}

@Collection()
export class City {

  @Ignore()
  id: string | null = null

  country: string | null = null
  
  name: string | null = null

  @MapTo({ target: "state_key" })
  state: string | null = null

  @DateType()
  creationDate: Date | null = null

  // @Ignore()
  optionalOption: number = 5

  @SubCollection({ type: Street })
  streets?: ISubcollection<Street>

}

