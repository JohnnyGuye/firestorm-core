import { Firestore } from "firebase/firestore";
import { CollectionDocumentTuples, IFirestormModel } from "../../core";
import { Type } from "../../core/type";
import { Repository } from "../repository";

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
      parentPath?: CollectionDocumentTuples
  ) => R;