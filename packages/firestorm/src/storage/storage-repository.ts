import { UploadTaskObservable } from "./upload/upload-task-observable";
import { FirebaseStorage, ref, uploadBytesResumable } from "firebase/storage";

/**
 * FirestORM storage wrapper
 * 
 * ⚠️ Really under featured
 */
export class FirestormStorage {

  /**
   * Creates a {@link FirestormStorage}
   * @param storage Firebase storage
   */
  constructor(private readonly storage: FirebaseStorage) {}

  /**
   * Creates an observable, observing the upload of a file at the uri given.
   * 
   * @param file File to upload
   * @param uriInBucket Where to upload it
   * @returns An observable on the upload
   */
  public uploadFileTo(file: File, uriInBucket: string): UploadTaskObservable {

    const fileRef = ref(this.storage, uriInBucket)

    return UploadTaskObservable.fromUploadTask(() => uploadBytesResumable(fileRef, file))
  
  }

}