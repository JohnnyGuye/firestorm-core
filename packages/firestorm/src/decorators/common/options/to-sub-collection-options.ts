import { FirestormModel } from "../../../core"
import { ITypedOptions } from "./base-blocks"

/**
 * Options for the {@link ToSubCollection} decorator
 */
export type ToSubCollectionOptions<T_target_model extends FirestormModel>
    = ITypedOptions<T_target_model>
