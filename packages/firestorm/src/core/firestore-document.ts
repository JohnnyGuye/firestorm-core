export interface FirestoreDate {
  seconds: number
  nanoseconds: number
}

export function isFirestoreDate(value: unknown): value is FirestoreDate {
  if (!value || typeof value !== 'object') return false
  return 'seconds' in value 
    && 'nanoseconds' in value
    && Number.isInteger(value.seconds)
    && Number.isInteger(value.nanoseconds)
}


export type FirestoreFieldBaseType 
  = number 
  | string 
  | boolean 
  | Date 
  | null

export type FirestoreDocumentField
  = FirestoreFieldBaseType 
  | FirestoreFieldBaseType[] 
  | Record<string, FirestoreFieldBaseType>

/**
 * Type for a firestore document
 */
export type FirestoreDocument = Record<string, FirestoreDocumentField>


export type StringArrayField = Array<string>

export function isStringArrayField(value: unknown): value is StringArrayField {

  if (!value) return false

  if (typeof value !== "object") return false

  if (!(value instanceof Array)) return false

  for (let item of value) {
      if (typeof item !== "string") return false
  }

  return true
}