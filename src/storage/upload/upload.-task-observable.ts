import { Observable, Subscriber, TeardownLogic } from "rxjs";
import { UploadTaskChangeEvent, UploadTaskCompleteEvent, UploadTaskEvent } from "./upload-task.event";
import { UploadTask, UploadTaskSnapshot, getDownloadURL } from "firebase/storage";


/**
 * Creates an UploadTaskChangeEvent from a firebase UploadTaskSnapshot
 * @param snapshot 
 * @returns 
 */
function fromFirebaseUploadTaskSnapshot(snapshot: UploadTaskSnapshot) {
  return new UploadTaskChangeEvent(snapshot.state, snapshot.bytesTransferred, snapshot.totalBytes)
}

export class UploadTaskObservable extends Observable<UploadTaskEvent> {

  constructor(
    subscribe: ((this: Observable<UploadTaskEvent>, subscriber: Subscriber<UploadTaskEvent>) => TeardownLogic)) {
    super(subscribe)
  }

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
