import { Observable } from "rxjs";
import { UploadTaskChangeEvent, UploadTaskCompleteEvent, UploadTaskEvent } from "./upload-task.event";
import { UploadTask, UploadTaskSnapshot, getDownloadURL } from "firebase/storage";
import { SubscribeFunction } from "@firestorm/src/core/observable";


/**
 * Creates an UploadTaskChangeEvent from a firebase UploadTaskSnapshot
 * @param snapshot 
 * @returns An upload task change event
 */
function fromFirebaseUploadTaskSnapshot(snapshot: UploadTaskSnapshot) {
  return new UploadTaskChangeEvent(snapshot.state, snapshot.bytesTransferred, snapshot.totalBytes)
}

/**
 * Creates an observable around an file upload task
 */
export class UploadTaskObservable extends Observable<UploadTaskEvent> {

  /**
   * Creates an {@link UploadTaskObservable}
   * 
   * @param subscribe 
   */
  protected constructor(subscribe: SubscribeFunction<UploadTaskEvent>) {
    super(subscribe)
  }

  /**
   * Creates an {@link UploadTaskObservable} from an UploadTask from firebase's api
   * @param uploadTaskResolver 
   * @returns 
   */
  public static fromUploadTask(uploadTaskResolver: () => UploadTask) {

    return new UploadTaskObservable(
      (observable) => {

        const uploadTask = uploadTaskResolver()
        const fileRef = uploadTask.snapshot.ref
        
        uploadTask.on(
          'state_changed', 
          (snapshot) => {
            observable.next(fromFirebaseUploadTaskSnapshot(snapshot))
          },
          (error) => {
            console.error(error)
            observable.error(error)
          },
          async () => {
            const dlUrl = await getDownloadURL(fileRef)
            observable.next(new UploadTaskCompleteEvent(uploadTask.snapshot.totalBytes, dlUrl))
            observable.complete()
          }
        )

        observable.add(() => uploadTask.cancel())
      }
    )

  }
}
