import { FirestormModel } from "../../../core"
import { IRelativeLocationOptions, ITypedOptions } from "./base-blocks"

/**
 * Options for the {@link ToCollection} decorator
 */
export type ToCollectionOptions<T_target_model extends FirestormModel>
    = IRelativeLocationOptions & ITypedOptions<T_target_model>
