import { DocumentReference, DocumentSnapshot, Firestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { IFirestormModel } from "../core/firestorm-model";
import { Repository } from "./repository";
import { IParentCollectionOptions } from "./parent-collection-options.interface";
import { Type } from "../core/helpers";
import { RepositoryGeneratorFunction } from "./repository-creation-function";

/**
 * Repository with a basic CRUD implemention for collections of one named document.
 */
export class SingleDocumentRepository<T extends IFirestormModel> extends Repository<T> {
  
  /**
   * Id of the document
   */
  public documentId: string = ""

  constructor(
    type: Type<T>,
    firestore: Firestore,
    parents?: IParentCollectionOptions<IFirestormModel>[]
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
  async writeAsync(model: T) {

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
   * @param model Partial or full model to update. It must have an id.
   * @returns A Promise that resolved when the item has been updated
   */
  async updateAsync(model: Partial<T>) {

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
    
    return this.firestoreDocumentSnapshotToClass(documentSnapshot)
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
      parentCollections?: IParentCollectionOptions[]
  ) => {
      const repo = new SingleDocumentRepository(type, firestore, parentCollections)
      repo.documentId = documentId
      return repo
  }
}
