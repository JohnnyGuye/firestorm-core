import { Firestore } from "firebase/firestore";
import { IFirestormModel } from "../core/firestorm-model";
import { Type } from "../core/helpers";
import { Repository } from "./repository";
import { IParentCollectionOptions } from "./parent-collection-options.interface";

/**
 * Type for repository generator function that can be given to firestorm to instantiate a repository
 * @template R The type of repository created
 * @template T The model of the documents in the repository
 */
export type RepositoryGeneratorFunction<R extends Repository<T>, T extends IFirestormModel>
  = (
      firestore: Firestore, 
      type: Type<T>, 
      parentCollections?: IParentCollectionOptions[]
  ) => R;