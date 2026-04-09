import { dateFromFirestoreDate, FirestoreDocumentField, FirestoreFieldBaseType, FirestormModel, isFirestoreDate } from "../../../core";
import { ComplexType } from "./complex-type.decorator";

/**
 * Decorator for maps
 * 
 * It enables easy serialization of Map fields.
 * These maps are limited to the basic FirestoreFieldBaseType and therefore cannot be maps of maps.
 * You'll have to implement your own serializer for that.
 * 
 * @returns 
 */
export function MapType<T_model extends FirestormModel, K extends string>() {

    return ComplexType<Map<FirestoreFieldBaseType, FirestoreFieldBaseType> | null, T_model, K>({
        
        toModel: (object: FirestoreDocumentField) => {
            if (!object) return null

            if (typeof object !== "object") throw new Error("Cannot properly deserialize the field with the MapType deserializer.")

            const m = new Map<FirestoreFieldBaseType, FirestoreFieldBaseType>()

            for (let [key, value] of Object.entries(object)) {
                if (isFirestoreDate(value)) value = dateFromFirestoreDate(value)
                m.set(key, value)
            }

            return m
        },

        toDocument: (model: Map<FirestoreFieldBaseType, FirestoreFieldBaseType> | null) => {
            
            if (!model) return null

            return Object.fromEntries(model.entries())
        }

    })

}