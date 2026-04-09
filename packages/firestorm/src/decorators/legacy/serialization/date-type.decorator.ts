import { FirestoreDocumentField, isFirestoreDate, FirestormModel, dateFromFirestoreDate } from "../../../core";
import { ComplexType } from "./complex-type.decorator";

/**
 * Decorator for Date fields.
 * 
 * It enables easy serialization of Date fields
 * 
 * @returns 
 */
export function DateType<T_model extends FirestormModel, K extends string>() {
  
  return ComplexType<Date | null, T_model, K>({

    toModel: (object: FirestoreDocumentField) => {
      return isFirestoreDate(object) ? dateFromFirestoreDate(object) : null
    },

    toDocument: (model: Date | null) => {
      return model as unknown as FirestoreDocumentField
    }

  })
}