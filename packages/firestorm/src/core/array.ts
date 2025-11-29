/**
 * Splits the array in smallers arrays of a specific maximum size.
 * 
 * @param sourceArray Array to split
 * @param batchSize Maximum size of a batch
 */
export function* splitInBatches<T>(sourceArray: T[], batchSize: number) {

    if (batchSize < 1) batchSize = 1

    for (let batchIndex = 0; batchIndex * batchSize < sourceArray.length; batchIndex++) {
    
        const start = batchIndex * batchSize
        const end = Math.min(start + batchSize, sourceArray.length)
        
        yield sourceArray.slice(start, end)

    }

}