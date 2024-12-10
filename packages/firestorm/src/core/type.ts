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

export function isIn<K extends string>(object: unknown, propertyName: K): object is Record<K, any> {
    if (object === null || object === undefined || typeof object !== 'object') return false
    return propertyName in object
}