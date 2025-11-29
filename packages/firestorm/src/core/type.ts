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

/**
 * Duck types an object by checking if it has a field named fieldName
 * @param object The object to test
 * @param fieldName The name of the field to check
 * @returns 
 */
export function isIn<K extends string>(object: unknown, fieldName: K): object is Record<K, any> {
    if (object === null || object === undefined || typeof object !== 'object') return false
    return fieldName in object
}

/**
 * Checks if the given host object has a property or field with a given name containing an value of a given type
 * 
 * /!\ It doesn't support non object types.
 * 
 * @template T Expected type of the value in the property/field
 * @template K Litteral of the field/property name
 * 
 * @param host Host object to test
 * @param fieldName Name of the property or field to test
 * @param type Expected type of the value in the property/field
 * @returns 
 */
export function hasFieldOfType<T,const K extends string>(host: unknown, fieldName: K, type: Type<T>): host is Record<K, T> {

    if (!host) return false

    if (typeof host != 'object') return false

    const valueAny = host as any
    if (!(fieldName in valueAny)) return false
    
    return valueAny[fieldName] instanceof type

}