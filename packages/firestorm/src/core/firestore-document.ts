/**
 * Interface for the representation of a date in a firestore document
 */
export interface FirestoreDate {

  /**
   * Amount of seconds
   */
  seconds: number

  /**
   * Amount of nanoseconds
   */
  nanoseconds: number

}

/**
 * Duck types if the object is a firestore date
 * 
 * @param value Object to verify
 * @returns True if value is a FirestoreDate
 */
export function isFirestoreDate(value: unknown): value is FirestoreDate {

  if (!value || typeof value !== 'object') return false

  return 'seconds' in value 
    && 'nanoseconds' in value
    && Number.isInteger(value.seconds)
    && Number.isInteger(value.nanoseconds)
}

/**
 * Base field types in a firestore document
 */
export type FirestoreFieldBaseType 
  = number 
  | string 
  | boolean 
  | Date
  | FirestoreDate
  | null

/**
 * Composite field types in a firestore document (built using other documents)
 */
export type FirestoreFieldCompositeType
  = FirestoreFieldBaseType[] 
  | Record<string, FirestoreFieldBaseType>

/**
 * Field types in a firestore document
 */
export type FirestoreDocumentField
  = FirestoreFieldBaseType
  | FirestoreFieldCompositeType

/**
 * Type for a firestore document
 */
export type FirestoreDocument = Record<string, FirestoreDocumentField>

/**
 * Array containing strings
 */
export type StringArrayField = Array<string>

/**
 * Check if the value is an array with strings. It verifies every single item in the array
 * @param value Object to test
 * @returns True if the object is an array with only strings.
 */
export function isStringArrayField(value: unknown): value is StringArrayField {

  if (!value) return false

  if (typeof value !== "object") return false

  if (!(value instanceof Array)) return false

  for (let item of value) {
      if (typeof item !== "string") return false
  }

  return true
}