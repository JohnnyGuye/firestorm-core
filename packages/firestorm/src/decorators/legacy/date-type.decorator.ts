import { FirestoreDocumentField, isFirestoreDate } from "../../core/firestore-document";
import { FirestormModel } from "../../core/firestorm-model"
import { ComplexType } from "./complex-type.decorator";

// Timestamp.fromDate()
/**
 * Decorator for Date fields.
 * 
 * It enables easy serialization of date fields
 * (for now, milliseconds are lost in the sauce)
 * @returns 
 */
export function DateType<T_model extends FirestormModel, K extends string>() {
  return ComplexType<Date | null, T_model, K>({
    toModel: (object: FirestoreDocumentField) => {
      if (!isFirestoreDate(object)) return null
      return new Date(object.seconds * 1000 + Math.floor(object.nanoseconds / 1_000_000))
    },
    toDocument: (model: Date | null) => {
      return model as unknown as FirestoreDocumentField
    }
  })
}