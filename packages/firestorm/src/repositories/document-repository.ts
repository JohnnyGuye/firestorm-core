import { doc, Firestore } from "firebase/firestore";
import { CollectionDocumentTuples, IFirestormModel, Type } from "../core";
import { Repository } from "./repository";
import { RepositoryInstantiator } from "./common";

/**
 * Creates a repository that acts as an anchor.
 * It doesn't have any methods to modify the document.
 */
export class DocumentRepository<T_model extends IFirestormModel> extends Repository<T_model> {
  
  /**
   * Id of the document
   */
  public documentId: string = ""

  /**
   * Creates a new {@link DocumentRepository} on a model
   * @param type Type on which the repository operates
   * @param firestore The instance of firestore this repository connects to
   * @param parents The optional parent collections for repositories of subcollections
   */
  constructor(
    type: Type<T_model>,
    firestore: Firestore,
    parents?: CollectionDocumentTuples
    ) {
    
    super(type, firestore, parents)
  }

  /**
   * Gets a reference on the document
   */
  protected get documentRef() {
    return doc(this.firestore, this.collectionPath, this.documentId)
  }

  //#region Linked repositories


  //#endregion

}

/**
 * Gets the generator function for a {@link DocumentRepository} of model {@link T}
 * @template T Model of the document tracked.
 * @param documentId The id of the document that the generated repository should track.
 * @returns A function that generated a single document repository on the document provided.
 */
export function createDocumentRepositoryInstantiator<T extends IFirestormModel>(documentId: string): RepositoryInstantiator<DocumentRepository<T>, T> {
  return (
      firestore: Firestore, 
      type: Type<T>, 
      parentPath?: CollectionDocumentTuples
  ) => {
      const repo = new DocumentRepository(type, firestore, parentPath)
      repo.documentId = documentId
      return repo
  }
}