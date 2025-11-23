import { DifferentError, DifferentReferenceError, DisimilarObjectsError, IncorrectArrayLengthError, NotAnArrayError, NotNullError, NullError, SimilarObjectsError } from "./errors"

class Expect {

    constructor(public readonly object: any) {}

    toShareReferenceWith(oth: any) {
        if (this.object !== oth) {
            throw new DifferentReferenceError(this.object, oth)
        }
    }

    toEqual(oth: any) {
        if (this.object != oth) {
            throw new DifferentError(this.object, oth)
        }
    }

    toBeNull() {
        if (this.object != null) {
            throw new NotNullError(this.object)
        }
    }

    toNotBeNull() {
        if (this.object == null) {
            throw new NullError(this.object)
        }
    }

    toBeOfLength(length: number) {
        if (this.object instanceof Array) {
            if (this.object.length != length) {
                throw new IncorrectArrayLengthError(this.object, length)
            }

            return 
        }
        
        throw new NotAnArrayError(this.object)
    }

    toBe(oth: unknown) {
        if (!deepEquals(this.object, oth)) {
            throw new DisimilarObjectsError(this.object, oth)
        }
    }

    toNotBe(oth: unknown) {
        if (deepEquals(this.object, oth)) {
            throw new SimilarObjectsError(this.object, oth)
        }
    }

    toBeTrue() {
        if (this.object !== true) {
            throw new Error("The object isn't true")
        }
    }

    toBeFalse() {
        if (this.object !== false) {
            throw new Error("The object isn't false")
        }
    }

    toBeLesserThan(value: number) {
        if (typeof this.object !== "number") {
            throw new Error("Not testing a number")
        }

        if (this.object >= value) {
            throw new Error(`The number ${this.object} is not lesser than ${value}`)
        }
    }

    async toThrowAsync() {
        if (typeof this.object !== "function") {
            throw new Error("Must be a function")
        }

        try 
        {
            await this.object()
        } 
        catch(err) {
            return    
        }

        throw new Error("Must throw")
    }

    
}
function deepEquals(lhs: unknown, rhs: unknown): boolean {
    
    if (lhs === null && rhs === null) return true
    if (lhs === undefined && rhs === undefined) return true
    if (lhs === null || rhs === null) return false
    if (lhs === undefined || rhs === undefined) return false

    if (typeof lhs !== typeof rhs) return false
        
    switch (typeof lhs) {
        case "undefined":   return true // Same value by design
        case "function":    return true // Does not check for functions matching
        case "symbol":      return true // Does not check for symbol matching
        case "bigint":      return lhs === rhs; break;
        case "boolean":     return lhs === rhs; break;
        case "number":      return lhs === rhs; break;
        case "string":      return lhs === rhs; break;
        case "object": 
        {
            if (typeof rhs !== 'object') return false

            // The objects are arrays
            if (lhs instanceof Array && rhs instanceof Array) {
                if (rhs.length != lhs.length) {
                    return false
                }

                for (let i = 0; i < rhs.length; i++) {
                    const l = lhs[i]
                    const r = rhs[i]
                    if (!deepEquals(l, r)) return false
                }

                return true
            }

            // Only one object is an array
            if (lhs instanceof Array || rhs instanceof Array) {
                return false
            }
            
            // Both objects are indeed objects
            for (let propName of Object.getOwnPropertyNames(lhs)) {

                if (!(propName in lhs)) return false
                if (!(propName in rhs)) return false

                if (!deepEquals((lhs as any)[propName], (rhs as any)[propName])) return false
            }
            
            return true;
        }
        default: 
            console.warn("Unknown object type ", lhs, rhs)
        return false;
    }
            
}

export function expect(object: any) {
    return new Expect(object)
}