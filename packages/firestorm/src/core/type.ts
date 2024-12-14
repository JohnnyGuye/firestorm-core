/**
 * Describes a function that can generate an object
 */
export declare const Type: FunctionConstructor;

/**
 * Newable function of T
 * @template T Type of the object
 */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export declare interface Type<T> extends Function {
    /** 
     * constructor with any params 
     * @param args any param
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    new (...args: any[]): T;
}

export function isIn<K extends string>(object: unknown, fieldName: K): object is Record<K, any> {
    if (object === null || object === undefined || typeof object !== 'object') return false
    return fieldName in object
}

export function hasFieldOfType<T,const K extends string>(value: unknown, fieldName: K, type: Type<T>): value is Record<K, T> {

    if (!value) return false
    if (typeof value != 'object') return false
    const valueAny = value as any
    if (!(fieldName in valueAny)) return false
    
    return valueAny[fieldName] instanceof type

}