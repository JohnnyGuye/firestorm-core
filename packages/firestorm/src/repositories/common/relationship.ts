import { FirestormModel } from "../../core";

/**
 * For 
 */
export type RelationshipIncludes<T_model extends FirestormModel>
  = Partial<Record<keyof T_model, boolean>>