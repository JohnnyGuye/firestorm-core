import { DocumentReference, DocumentSnapshot, Firestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { IFirestormModel } from "../core/firestorm-model";
import { BaseRepository } from "./base-repository";
import { IParentCollectionOption } from "./parent-collection.interface";
import { Type } from "../core/helpers";

/**
 * Repository with a basic CRUD implemention for collections of one named document.
 */
export class SingleDocumentRepository<T extends IFirestormModel> extends BaseRepository<T> {
  
  /**
   * Id of the document
   */
  public documentId: string = ""

  constructor(
    type: Type<T>,
    firestore: Firestore,
    parents?: IParentCollectionOption<IFirestormModel>[]
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
    
    const data = this.classToFirestoreDocument(model)

    await setDoc(documentRef, data)

    return model
  }

  /**
   * Modifies the item in the database.
   * 
   * The id, if provided, is ignored in the model and set to this.documentId
   * @param model Partial or full model to update. It must have an id.
   * @returns A Promise that resolved when the item has been updated
   */
  async updateAsync(model: Partial<T>) {

    model.id = this.documentId
    const documentRef: DocumentReference = this.documentRef

    const data = this.classToFirestoreDocument(model)

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
   * @warning It's usng getAsync under the hood so it's almost always preferable to use the other. It's just a convenience
   * @returns 
   */
  async existsAsync() {
    return await this.getAsync() != null
  }

  private get documentRef() {
    return doc(this.firestore, this.collectionPath, this.documentId)
  }
}