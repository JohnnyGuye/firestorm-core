import namesJson from "../../../assets/data/names-generator.json"
import { generateInt } from "./number-generators"

export function generateName() {
    
    const nl = namesJson.name.length
    const al = namesJson.adjective.length

    return [
        namesJson.adjective[generateInt(al)],
        namesJson.name[generateInt(nl)]
    ].join(" ")
}