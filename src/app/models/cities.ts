import { Collection, MapTo } from "src/firestorm/decorators"
import { DateType } from "src/firestorm/decorators/date-type.decorator"
import { Ignore } from "src/firestorm/decorators/ingore.decorator"

@Collection()
export class City {

  id: string | null = null

  country: string | null = null
  
  name: string | null = null

  @MapTo({ target: "state_key" })
  state: string | null = null

  @DateType()
  creationDate: Date | null = null

  @Ignore()
  optionalOption: number = 5
}