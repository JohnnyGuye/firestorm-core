import { ComplexType } from "./complex-type.decorator";

export function DateType() {
  return ComplexType({
    toDocument: (object: any) => {
      if (object === null || object === undefined) return null

      if ("seconds" in object) {
        return new Date((+object.seconds) * 1000)
      }

      return null
    },
    toModel: (model: Date) => {
      return model
    }
  })
}