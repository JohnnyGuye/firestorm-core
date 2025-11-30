import { DocumentReference, DocumentSnapshot, Firestore, SnapshotListenOptions, deleteDoc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { IFirestormModel } from "../core/firestorm-model";
import { Type } from "../core/type";
import { createDocumentObservable, DocumentObservable } from "../realtime-listener";
import { PathLike } from "../core";
import { RelationshipIncludes, RepositoryInstantiator } from "./common";
import { DocumentRepository } from "./document-repository";
import { includeResolver } from "./toolkit";

/**
 * Repository with a basic CRUD implemention for collections of one named document.
 */
export class DocumentCrudRepository<T_model extends IFirestormModel> extends DocumentRepository<T_model> {
  
  /**
   * Creates a new {@link DocumentCrudRepository} on a model
   * @param type Type on which the repository operates
   * @param firestore The instance of firestore this repository connects to
   * @param path The optional parent collections for repositories of subcollections
   */
  constructor(
    type: Type<T_model>,
    firestore: Firestore,
    path?: PathLike
    ) {
    
    super(type, firestore, path)
  }

  /**
   * Writes a new item in the databse.
   * 
   * The id is ignored in the model and set to this.documentId
   * 
   * @param model Model to store
   * @returns 
   */
  async writeAsync(model: T_model) {

    model.id = this.documentId
    const documentRef: DocumentReference = this.documentRef
    
    const data = this.modelToDocument(model)

    await setDoc(documentRef, data)

    return model
  }

  /**
   * Modifies the item in the database.
   * 
   * The id, if provided, is ignored in the model and set to this.documentId
   * 
   * It will fail if the document doesn't exist.
   * 
   * @param model Partial or full model to update. It must have an id.
   * @returns A Promise that resolved when the item has been updated
   */
  async updateAsync(model: Partial<T_model>) {

    model.id = this.documentId
    const documentRef: DocumentReference = this.documentRef

    const data = this.modelToDocument(model)

    await updateDoc(documentRef, data)

    return
  }

  /**
   * Gets the document of this repository
   * 
   * @returns A promise containing either the item retrieved or null if it doesn't exist
   */
  async getAsync(includes?: RelationshipIncludes<T_model> ) {

    const docRef: DocumentReference = this.documentRef
    const documentSnapshot: DocumentSnapshot = await getDoc(docRef)

    if (!documentSnapshot.exists()) return null
    
    const model = this.firestoreDocumentSnapshotToModel(documentSnapshot)

    if (!includes) return model

    await Promise.all(includeResolver(includes, model, this.typeMetadata, this))

    return model
  }

  /**
   * Listens to the changes of the document
   * @returns An observable on the document's changes
   */
  listen(): DocumentObservable<T_model> {
    const options: SnapshotListenOptions = { includeMetadataChanges: false, source: 'default' }
    return createDocumentObservable(this, this.documentRef, options)
  }

  /**
   * Check if the document exists in the database
   *
   * If you need to use the document later in the process, {@link getAsync} is a better fit
   * @returns 
   */
  async existsAsync() {
    return (await this.getAsync()) != null
  }

  /**
   * Deletes the document in the database.
   * It doesn't delete its subcollection if any.
   * 
   * Trying to delete a document that doesn't exist will just silently fail
   * 
   * @returns A promise that returns when the document has been deleted
   */
  async deleteAsync() {

    const docRef: DocumentReference = this.documentRef
    return await deleteDoc(docRef)

  }

}

/**
 * Gets the generator function for a {@link DocumentCrudRepository} of model {@link T}
 * @template T Model of the document tracked.
 * @param documentId The id of the document that the generated repository should track.
 * @returns A function that generated a single document repository on the document provided.
 */
export function createDocumentCrudRepositoryInstantiator<T extends IFirestormModel>(documentId: string): RepositoryInstantiator<DocumentCrudRepository<T>, T> {
  return (
      firestore: Firestore, 
      type: Type<T>, 
      path?: PathLike
  ) => {
      const repo = new DocumentCrudRepository(type, firestore, path)
      repo.documentId = documentId
      return repo
  }
}
