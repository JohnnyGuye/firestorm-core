export class TestError extends Error {

    constructor(public readonly source: any, message: string) {
        super(message)
    }

}

export class DifferentReferenceError extends TestError {

    constructor(source: any, public readonly oth: any) {
        super(source, `The two objects do not have the same reference.`)
    }

}

export class DifferentError extends TestError {

    constructor(source: any, public readonly oth: any) {
        super(source, `The two objects should be equal using the "==" operator.`)
    }

}

export class NotNullError extends TestError {
    
    constructor(source: any) {
        super(source, "The object was expected to be null")
    }
}

export class NullError extends TestError {
    
    constructor(source: any) {
        super(source, "The object was expected to not be null")
    }
}

export class NotAnArrayError extends TestError {
    
    constructor(source: any) {
        super(source, "The object was expected to be an array and isn't.")
    }

}

export class NotAMapError extends TestError {
    
    constructor(source: any) {
        super(source, "The object was expected to be a map and isn't.")
    }

}

export class NeitherMapOrArray extends TestError {

    constructor(source: any) {
        super(source, "The object was expected to be an array or map and isn't.")
    }
}

export class IncorrectArrayLengthError extends TestError {

    constructor(source: Array<any>, public readonly expectedLength: number) {
        super(source, `The array was expected to be of length ${expectedLength} but is of length ${source.length} `)
    }
}

export class IncorrectMapSizeError extends TestError {

    constructor(source: Map<any, any>, public readonly expectedSize: number) {
        super(source, `The map was expected to be of size ${expectedSize} but is of length ${source.size} `)
    }
}

export class DisimilarObjectsError extends TestError {

    constructor(source: any, public readonly oth: any) {
        super(source, `The objects are dissimilar`)
    }
}

export class SimilarObjectsError extends TestError {

    constructor(source: any, public readonly oth: any) {
        super(source, `The objects are similar`)
    }
}