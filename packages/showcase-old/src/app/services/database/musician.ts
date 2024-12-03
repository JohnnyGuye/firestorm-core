import { Collection } from "@firestorm/core";

@Collection({ collection: "musicians" })
export class Musician {

  id: string | null = null

  name: string | null = null

  instruments: string[] = []

}