import { FIRESTORM_METADATA_STORAGE } from "../../../../metadata-storage";
import { FirestormModel, ForwardRef, Type } from "../../../../core";

/**
 * Base interface for options requiring a lazy type
 */
export interface ILazyTypedOptions<T extends FirestormModel> {
  
  /** Forward ref to the model */
  targetTypeForwardRef: ForwardRef<T>

}

/**
 * Base interface for options requiring an eager type
 */
export interface IEagerTypedOptions<T extends FirestormModel> {

    /** Type of the model assosciated */
    targetType: Type<T>

}

/**
 * Base interface for options requiring the type of a targeted model
 */
export type ITypedOptions<T extends FirestormModel>
  = ILazyTypedOptions<T> | IEagerTypedOptions<T>

export function isLazyTyped<T extends FirestormModel>(options: ITypedOptions<T>): options is ILazyTypedOptions<T> {
  return "targetTypeForwardRef" in options
}

export function isEagerTyped<T extends FirestormModel>(options: ITypedOptions<T>): options is IEagerTypedOptions<T> {
  return "targetType" in options
}

export function typeResolutionDispatcher<T extends FirestormModel>(options: ITypedOptions<T>, onTypeResolved: (type: Type<T>) => void) {
    
  if (isEagerTyped(options)) {
      
    onTypeResolved(options.targetType)
      
  } else if (isLazyTyped(options)) {
      
    const storage = FIRESTORM_METADATA_STORAGE
    storage.registerForwardRef(options.targetTypeForwardRef, onTypeResolved)

  } else {

    throw new Error("The options doesn't have targeted type.")
    
  }


}
