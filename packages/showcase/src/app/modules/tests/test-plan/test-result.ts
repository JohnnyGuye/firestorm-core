export class TestResult {

    constructor(public readonly error?: unknown) {}

    get success() {
        return !this.error
    }

}