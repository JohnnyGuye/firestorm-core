import { UploadTaskObservable } from "./upload/upload-task-observable";
import { FirebaseStorage, ref, uploadBytesResumable } from "firebase/storage";

export class StorageRepository {


  constructor(protected readonly storage: FirebaseStorage) {}

  /**
   * Creates an observable, observing the upload of a file at the uri given.
   * @param file File to upload
   * @param uriInBucket Where to upload it
   * @returns An observable on the upload
   */
  public uploadFileTo(file: File, uriInBucket: string): UploadTaskObservable {

    const fileRef = ref(this.storage, uriInBucket)

    return UploadTaskObservable.fromUploadTask(() => uploadBytesResumable(fileRef, file))
  
  }

}