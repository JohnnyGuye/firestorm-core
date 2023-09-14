import { ComplexType } from "./complex-type.decorator";

/**
 * Decorator for Date fields.
 * 
 * It enables easy serialization of date fields
 * (for now, milliseconds are lost in the sauce)
 * @returns 
 */
export function DateType() {
  return ComplexType({
    toModel: (object: any) => {
      if (object === null || object === undefined) return null

      if ("seconds" in object) {
        return new Date((+object.seconds) * 1000)
      }

      return null
    },
    toDocument: (model: Date | null) => {
      return model
    }
  })
}