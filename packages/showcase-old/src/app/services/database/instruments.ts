import { Collection } from "@firestorm/core"

@Collection({ collection: "instruments" })
export class Instrument {

  id: string | null = null

  name: string = ""

  cost: number = 0
  
}