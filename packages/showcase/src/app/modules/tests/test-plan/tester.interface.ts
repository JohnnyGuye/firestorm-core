import { TestState } from "./state";

export interface ITester {

    /**
     * Name of the test
     */
    readonly name: string

    /** 
     * Description of the test
     */
    readonly description: string

    /**
     * Runs the test with the hooks
     */
    run(): Promise<void>;

    /**
     * Applies the state {@link TestState.Ignored} to the tester
     */
    markAsIgnored(): void;

    /**
     * Resets the state of the tester
     */
    reset(): void;

    /**
     * Current state of the tester
     */
    readonly state: TestState

    /**
     * Whether or not to run this test
     */
    readonly ignore: boolean

}