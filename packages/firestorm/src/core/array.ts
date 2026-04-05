/**
 * Splits the array in smallers arrays of a specific maximum size.
 * 
 * It is O(n) in complexity.
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

/**
 * Splits the array into subgroups
 * 
 * It is O(n) in complexity.
 * 
 * @template T Type of the items in the array
 * @template K Type of the key, it must be a base type.
 * @param sourceArray Array to split
 * @param extractKeyFn The function that gives the key of the group of an item
 * @returns A map of the items grouped by their extracted key.
 */
export function groupBy<T, K>(sourceArray: T[], extractKeyFn: (item: T) => K): Map<K, T[]> {
    
    const groups = new Map<K, T[]>()

    for (let item of sourceArray) {
        const key = extractKeyFn(item)
        let group = groups.get(key)
        if (!group) {
            group = []
            groups.set(key, group)
        }
        group.push(item)
    }

    return groups
}

/**
 * Removes the duplicates in an array.
 * 
 * It is O(n) in complexity but you must an hashing function without collision
 * 
 * @template T Type of the items in the array
 * @template K Type of the key, it must be a base type.
 * @param sourceArray Array from which to remove the duplicates
 * @param hashingFn The function that is used to get an hash of the item to enable hashing. It MUST have no collision.
 * @returns A copy of the array without duplicates.
 */
export function distinctWithKey<T, K>(sourceArray: T[], hashingFn: (item: T) => K): T[] {
    const keys = new Set<K>()

    const resultArray = []

    for (let item of sourceArray) {
        
        const key = hashingFn(item)
        if (keys.has(key)) continue
        
        resultArray.push(item)
        keys.add(key)
        
    }

    return resultArray
}