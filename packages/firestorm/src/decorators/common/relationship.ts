import { FirestormModel, RelationshipLocation, Type } from "../../core"

/**
 * Options for the to one decorator
 */
export interface ToOneOptions<T_target_model extends FirestormModel> {

  target: Type<T_target_model>

  location: RelationshipLocation
  
}

