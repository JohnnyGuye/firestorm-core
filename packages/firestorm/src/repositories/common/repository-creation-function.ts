import { Firestore } from "firebase/firestore";
import { IFirestormModel } from "../../core/firestorm-model";
import { Type } from "../../core/type";
import { Repository } from "../repository";
import { IParentCollectionOptions } from "./parent-collection-options.interface";

/**
 * Type for repository generator function that can be given to firestorm to instantiate a repository
 * @template R The type of repository created
 * @template T The model of the documents in the repository
 * @param firestore The firestore instance the repository will feed on
 * @param type The type of model of the documents of this repository
 * @param parentCollections The parent collection leading to this repository
 */
export type RepositoryGeneratorFunction<R extends Repository<T>, T extends IFirestormModel>
  = (
      firestore: Firestore, 
      type: Type<T>, 
      parentCollections?: IParentCollectionOptions[]
  ) => R;