import { FirestormModel } from "../../../core"
import { IDocumentOptions, IRelativeLocationOptions, ITypedOptions } from "./base-blocks"

/**
 * Options for the {@link ToDocument} decorator
 */
export type ToDocumentOptions<T_target_model extends FirestormModel>
    = IRelativeLocationOptions 
    & ITypedOptions<T_target_model>
    & IDocumentOptions
