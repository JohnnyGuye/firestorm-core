import { generateInt } from "./number-generators";

export function getRandomInArray<T>(array: T[]) {
    return array[generateInt(array.length)]
}