export function* splitInBatches<T>(array: T[], batchSize: number) {
    for (let batchIndex = 0; batchIndex * batchSize < array.length; batchIndex++) {
        const start = batchIndex * batchSize
        const end = Math.min(start + batchSize, array.length)
        yield array.slice(start, end)
    }

}