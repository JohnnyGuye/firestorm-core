export enum TestState {

    Idle,
    Failed,
    Running,
    Ignored,
    Success

}

export function fuzeStates(testStates: Iterable<TestState>): TestState {

    let ss = [...testStates]

    if (ss.length == 0) {
        return TestState.Idle
    }
    
    if (ss.every(s => s == TestState.Ignored)) {
        return TestState.Ignored
    }

    ss = ss.filter(s => s != TestState.Ignored)

    if (ss.every(s => s == TestState.Success)) {
        return TestState.Success
    }

    ss = ss.filter(s => s != TestState.Success)

    if (ss.every(s => s == TestState.Idle)) {
        return TestState.Idle
    }

    if (ss.some(s => s == TestState.Running)) {
        return TestState.Running
    }

    if (ss.some(s => s == TestState.Failed)) {
        return TestState.Failed
    }

    console.error(ss.map(s => TestState[s]))
    throw new Error("Couldn't deduce a state")

}