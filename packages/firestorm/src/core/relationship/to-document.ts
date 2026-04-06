import { FirestormModel } from "../firestorm-model";

/**
 * The type of the property associated with a {@link ToDocument} decorator.
 * @template T_target_model Type of the models it should host
 */
export type ToDocumentRelationship<T_target extends FirestormModel>
    = T_target | null