export type AsyncTestFn = () => Promise<void>

export interface ITest {

    name: string
    description: string

}

export class Test implements ITest {

    public readonly name: string

    public readonly description: string

    public readonly test: AsyncTestFn

    constructor(name: string, test: AsyncTestFn);
    constructor(name: string, description: string, test: AsyncTestFn);
    constructor(name: string, descriptionOrTest: AsyncTestFn | string, test?: AsyncTestFn) {

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
