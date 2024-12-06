/**
 * Error throw when you try to execute operations on Firestore whilst not connected.
 */
export class MissingAppError extends Error {

  constructor() { super("[Firestorm] You must connect firestorm first.") }
}