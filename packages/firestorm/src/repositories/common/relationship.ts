import { FirestormModel } from "../../core";

/**
 * Specifies which documents to fetch that are linked with the host document.
 */
export type RelationshipIncludes<T_model extends FirestormModel>
  = Partial<Record<keyof T_model, boolean>>