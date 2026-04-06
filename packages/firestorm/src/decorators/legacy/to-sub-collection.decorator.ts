import { FirestormModel, SpecialSegments, ToCollectionRelationship } from "../../core";
import { ToSubCollectionOptions } from "../common/options";
import { ToCollection } from "./to-collection.decorator";

/**
 * Decorator for subcollection.
 * Fields marked as subcollection are ignored in the model but they can be requested in sub repositories.
 * 
 * It behaves similarly to a combination of the decorator Ignore on the field and Collection of the given type.
 * 
 * @param options 
 * @returns 
 */
// T_Sub extends ISubCollection<T_Model>,
export function ToSubCollection<
  T_model extends FirestormModel & Record<K, ToCollectionRelationship<T_target_model>>,
  T_target_model extends FirestormModel,
  K extends string
  >(
  options: ToSubCollectionOptions<T_target_model>
  ) {
  
  const toColOptions = {
    ...options,
    location: SpecialSegments.sibling
  }
  return ToCollection<T_model, T_target_model, K>(toColOptions)
}