import { TaskState as StorageTaskState } from "firebase/storage"

export type { TaskState as StorageTaskState } from "firebase/storage"

/**
 * Base event emitted each time an upload task has to emit
 */
export interface UploadTaskEvent {

  /**
   * State of the upload task
   */
  readonly state: StorageTaskState

  /**
   * Transfer completion rate
   */
  readonly completionRate: number

  /**
   * Bytes already transferred
   */
  readonly bytesTransferred: number

  /**
   * Amount of bytes until the end of the transfer
   */
  readonly remainingBytes: number

  /**
   * Total bytes to transfer
   */
  readonly totalBytes: number

}

/**
 * Event triggered when an upload task changes state
 */
export class UploadTaskChangeEvent implements UploadTaskEvent {

  private _byteTransferred: number
  private _totalBytes: number

  /**
   * Creates the event.
   * @param state State of the task
   * @param bytesTransferred Amount of byte already transferred
   * @param totalBytes Amount of bytes to transfer
   */
  constructor(
      public readonly state: StorageTaskState, 
      bytesTransferred: number, 
      totalBytes: number
    ) {

    this._byteTransferred = Math.max(0, bytesTransferred)
    this._totalBytes = Math.max(0, totalBytes, this.bytesTransferred)

  }

  /** @inheritdoc */
  get bytesTransferred() {
    return this._byteTransferred
  }

  /** @inheritdoc */
  get remainingBytes() {
    return this.totalBytes - this._byteTransferred
  }

  /** @inheritdoc */
  get totalBytes() {
    return this._totalBytes
  }

  /** @inheritdoc */
  get completionRate() {
    if (this.totalBytes == 0) return 1
    return this.bytesTransferred / this.totalBytes
  }

}

/**
 * Event triggered when an upload task is completed
 */
export class UploadTaskCompleteEvent implements UploadTaskEvent {

  private _bytes: number

  /**
   * Creates the event.
   * @param bytes Bytes uploaded
   * @param url Url at which the resource is available
   */
  constructor(bytes: number, public readonly url: string) {
    this._bytes = Math.max(0, bytes)
  }

  /** @inheritdoc */
  get bytesTransferred() {
    return this._bytes
  }

  /** @inheritdoc */
  get remainingBytes() {
    return 0
  }

  /** @inheritdoc */
  get totalBytes() {
    return this._bytes
  }

  /** @inheritdoc */
  get completionRate() { return 1 }

  /** @inheritdoc */
  get state(): 'success' {
    return 'success'
  }

}

/**
 * Event of a merge upload task
 */
export interface MergedUploadTaskEvent extends UploadTaskEvent {

  /**
   * Urls at which the resources are available. In the same order as the tasks.
   * 
   * If the url is undefined it means that the upload task for this file is not completed yet
   */
  readonly urls: (string | undefined)[]

}

/**
 * Merge of event of multiple sub upload tasks
 */
abstract class AbstractMergedUploadTaskEvent implements MergedUploadTaskEvent {

  private _byteTransferred: number = 0
  private _totalBytes: number = 0
  private _state: StorageTaskState = 'success'
  
  /** @inheritdoc */
  get bytesTransferred() {
    return this._byteTransferred
  }
  
  /**
   * @inheritdoc 
   * @param value Amount of bytes already transferred to set
   * */
  protected set bytesTransferred(value: number) {
    this._byteTransferred = value
  }

  /** @inheritdoc */
  get remainingBytes() {
    return this.totalBytes - this._byteTransferred
  }

  /** @inheritdoc */
  get totalBytes() {
    return this._totalBytes
  }
  
  /** 
   * @inheritdoc
   * @param value Amount of bytes to transfer in total to set
   * */
  protected set totalBytes(value: number) {
    this._totalBytes = value
  }

  /** @inheritdoc */
  get completionRate() {
    if (this.totalBytes == 0) return 1
    return this.bytesTransferred / this.totalBytes
  }

  /** @inheritdoc */
  get state() {
    return this._state
  }
  
  /**
   * Sets the state of the storage task
   * @param value New value of the state
   */
  protected set state(value: StorageTaskState) {
    this._state = value
  }

  /** @inheritdoc */
  abstract readonly urls: (string | undefined)[]

  /**
   * Merge multiple upload tasks event into one single upload task.
   * 
   * The completion rate is computing the participation of the subtasks int the total count of bytes
   * @param tasks Tasks to merge
   * @returns 
   */
  public static mergeUploadTaskEvents(tasks: UploadTaskEvent[]) {

    const mergedTask = tasks.reduce<MergedUploadTaskChangeEvent>(
      (acc, cur) => {
        acc.bytesTransferred += cur.bytesTransferred
        acc.totalBytes += cur.totalBytes

        if (cur instanceof UploadTaskCompleteEvent) {
          acc.urls.push(cur.url)
        } else {
          acc.urls.push(undefined)
        }

        if (cur.state === 'running') {
          acc.state = cur.state
        }

        return acc
      },
      new MergedUploadTaskChangeEvent()
    )

    if (mergedTask.urls.every(url => url != undefined)) {
      const mergedCompleteTask = new MergedUploadTaskCompleteEvent(
        mergedTask.totalBytes,
        mergedTask.urls as string[]
        )
      return mergedCompleteTask
    }

    return mergedTask
  }

}

/**
 * Merge of event of multiple sub upload tasks
 */
export class MergedUploadTaskChangeEvent extends AbstractMergedUploadTaskEvent {

  private _urls: (string | undefined)[] = []

  /** @inheritdoc */
  get urls() {
    return this._urls
  }



}

/**
 * Merge event raised when the upload task is completed
 */
export class MergedUploadTaskCompleteEvent extends AbstractMergedUploadTaskEvent {

  /**
   * Creates the event.
   * @param bytes Bytes uploaded
   * @param urls Urls at which the resources are available. In the same order as the tasks
   */
  constructor(bytes: number, public readonly urls: string[]) { 
    super()
    this.state = 'success'
    this.bytesTransferred = bytes
    this.totalBytes = bytes
    this.urls = urls
  }

}

export const mergeUploadTaskEvents = AbstractMergedUploadTaskEvent.mergeUploadTaskEvents