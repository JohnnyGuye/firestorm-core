import { generateInt } from "./number-generators";

export function getRandomInArray<T>(array: T[]) {
    return array[generateInt(array.length)]
}

export function getRandomsInArray<T>(array: T[], count: number) {
    const source = [...array]
    const picks = []

    while (source.length && (picks.length < count)) {
        const index = generateInt(source.length)
        picks.push(...source.splice(index, 1))
    }

    return picks
}