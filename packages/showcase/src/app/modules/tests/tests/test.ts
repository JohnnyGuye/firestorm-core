export type AsyncTestFn = () => Promise<void>

export interface ITest {

    /**
     * Name of the test
     */
    name: string

    /**
     * Optional description
     */
    description: string

    /**
     * If true, the test is not run
     */
    ignore: boolean

}

export interface TestOptions {

    ignore?: boolean 
    
}

export function isTest(value: unknown): value is ITest {
    return typeof value === "object"
        && !!value
        && "name" in value && typeof value.name === "string"
        && "description" in value && typeof value.description === "string"
}

export class Test implements ITest {

    public readonly name: string

    public readonly description: string

    public ignore: boolean = false

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

    setIgnore(value: boolean = true) {
        this.ignore = value
        return this
    }

}
