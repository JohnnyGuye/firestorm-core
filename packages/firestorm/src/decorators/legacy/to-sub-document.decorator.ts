import { FirestormModel, SpecialSegments, ToDocumentRelationship } from "../../core";
import { ToSubDocumentOptions } from "../common/options";
import { ToDocument } from "./to-document.decorator";

/**
 * Decorator for subdocument.
 * Fields marked as subdocument are ignored in the model but they can be requested in sub repositories.
 * 
 * @param options 
 * @returns 
 */
export function ToSubDocument<
  T_model extends FirestormModel & Record<K, ToDocumentRelationship<T_target_model>>,
  T_target_model extends FirestormModel,
  K extends string
  >(
  options: ToSubDocumentOptions<T_target_model>
  ) {
  
  const toDocOptions = {
    ...options,
    location: SpecialSegments.sibling
  }
  return ToDocument<T_model, T_target_model, K>(toDocOptions)
}