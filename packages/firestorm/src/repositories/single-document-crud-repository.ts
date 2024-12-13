import { DocumentReference, DocumentSnapshot, Firestore, SnapshotListenOptions, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { IFirestormModel } from "../core/firestorm-model";
import { Repository } from "./repository";
import { Type } from "../core/type";
import { createDocumentObservable, DocumentObservable } from "../realtime-listener";
import { CollectionDocumentTuples } from "../core";
import { RepositoryGeneratorFunction } from "./common";

/**
 * Repository with a basic CRUD implemention for collections of one named document.
 */
export class SingleDocumentRepository<T_model extends IFirestormModel> extends Repository<T_model> {
  
  /**
   * Id of the document
   */
  public documentId: string = ""

  /**
   * Creates a new {@link SingleDocumentRepository} on a model
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
  async getAsync() {

    const docRef: DocumentReference = this.documentRef
    const documentSnapshot: DocumentSnapshot = await getDoc(docRef)

    if (!documentSnapshot.exists()) return null
    
    return this.firestoreDocumentSnapshotToModel(documentSnapshot)
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
    return await this.getAsync() != null
  }

  private get documentRef() {
    return doc(this.firestore, this.collectionPath, this.documentId)
  }
}

/**
 * Gets the generator function for a {@link SingleDocumentRepository} of model {@link T}
 * @template T Model of the document tracked.
 * @param documentId The id of the document that the generated repository should track.
 * @returns A function that generated a single document repository on the document provided.
 */
export function getSingleDocumentRepositoryGenerator<T extends IFirestormModel>(documentId: string): RepositoryGeneratorFunction<SingleDocumentRepository<T>, T> {
  return (
      firestore: Firestore, 
      type: Type<T>, 
      parentPath?: CollectionDocumentTuples
  ) => {
      const repo = new SingleDocumentRepository(type, firestore, parentPath)
      repo.documentId = documentId
      return repo
  }
}
