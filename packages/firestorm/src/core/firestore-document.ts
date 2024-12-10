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


export type FirestoreFieldBaseType = number | string | boolean | Date | null

export type FirestoreDocumentField = FirestoreFieldBaseType | FirestoreFieldBaseType[] | Record<string, FirestoreFieldBaseType>
/**
 * Type for a firestore document
 */
export type FirestoreDocument = Record<string, FirestoreDocumentField>