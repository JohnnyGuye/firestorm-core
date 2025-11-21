import { DifferentError, DifferentReferenceError, IncorrectArrayLengthError, NotAnArrayError, NotNullError, NullError } from "./errors"

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

}

export function expect(object: any) {
    return new Expect(object)
}