import { IFirestormModel, PathLike } from "../../core";
import { Type } from "../../core/type";
import { Repository } from "../repository";
import type { Firestorm } from "../../firestorm";

/**
 * Type for repository generator function that can be given to firestorm to instantiate a repository
 * @template T_Repository The type of repository created
 * @template T_Model The model of the documents in the repository
 * @param firestorm The firestORM instance the repository will feed on
 * @param type The type of model of the documents of this repository
 * @param path The path leading to this repository
 */
export type RepositoryInstantiator<T_Repository extends Repository<T_Model>, T_Model extends IFirestormModel>
  = (
      firestorm: Firestorm,
      type: Type<T_Model>, 
      path?: PathLike
  ) => T_Repository;