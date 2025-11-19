export type TestFn = () => void

export interface ITest {

    name: string
    description: string

}

export class Test implements ITest {

    public readonly name: string

    public readonly description: string

    public readonly test: TestFn

    constructor(name: string, test: TestFn);
    constructor(name: string, description: string, test: TestFn);
    constructor(name: string, descriptionOrTest: TestFn | string, test?: TestFn) {

        this.name = name

        if (typeof descriptionOrTest === "string" && typeof test === "function") {
            this.description = descriptionOrTest
            this.test = test
            return
        }

        if (typeof descriptionOrTest === "function") {
            this.description = ""
            this.test = descriptionOrTest
            return
        }

        throw new Error("No constructor corresponds to these parameters")
    }

}
