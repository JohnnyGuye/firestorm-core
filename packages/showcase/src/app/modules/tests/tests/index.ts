import { Test } from "./test"
import { TestGroup } from "./test-group"

export * from "./test"
export * from "./test-group"

export type TestBlock = Test | TestGroup
export type TestPackage = TestBlock[]