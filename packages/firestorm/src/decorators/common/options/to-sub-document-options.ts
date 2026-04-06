import { FirestormModel } from "../../../core"
import { IDocumentOptions, ITypedOptions } from "./base-blocks"

/**
 * Options for the {@link ToSubDocument} decorator
 */
export type ToSubDocumentOptions<T_target_model extends FirestormModel>
    = ITypedOptions<T_target_model>
    & IDocumentOptions