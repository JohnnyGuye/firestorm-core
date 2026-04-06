import { FirestormModel, IdModelDictionary } from "../firestorm-model";

/**
 * The type of the property associated with a {@link ToCollection} decorator.
 * @template T_target_model Type of the models it should host
 */
export type ToCollectionRelationship<T_target_model extends FirestormModel> = IdModelDictionary<T_target_model>