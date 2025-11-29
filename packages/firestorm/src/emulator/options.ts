import { EmulatorMockTokenOptions as FirestoreEmulatorMockTokenOptions} from "firebase/firestore"
import { EmulatorMockTokenOptions as StorageEmulatorMockTokenOptions} from "firebase/storage"

/**
 * Basic infos required to connect to an emulator
 */
export interface BaseEmulatorConnectionOptions {
  /** Host url */
  readonly host: string
  /** Port where the emulator is available */
  readonly port: number
}

/**
 * Options for connection to the firestore emulator
 */
export interface FirestoreEmulatorConnectionOptions extends BaseEmulatorConnectionOptions {
  /**
   * Fake user token to be connected as a specific user
   */
  readonly mockUserToken?: FirestoreEmulatorMockTokenOptions | string | undefined
}

/**
 * Options for connection to the storage emulator
 */
export interface StoreEmulatorConnectionOptions extends BaseEmulatorConnectionOptions {
  /**
   * Fake user token to be connected as a specific user
   */
  readonly mockUserToken?: StorageEmulatorMockTokenOptions | string | undefined
}

/**
 * Options for the connection to the emulator
 */
export interface EmulatorConnectionOptions {
  /** Options for firestore */
  readonly firestore?: FirestoreEmulatorConnectionOptions
  /** Options for storage */
  readonly storage?: StoreEmulatorConnectionOptions
}

/**
 * Full set of options for the connection to the emulator
 */
export interface FullEmulatorConnectionOptions extends EmulatorConnectionOptions {
  firestore: Readonly<FirestoreEmulatorConnectionOptions>
  storage: Readonly<StoreEmulatorConnectionOptions>
}

/**
 * Default options for the emulator
 */
export const DEFAULT_EMULATOR_OPTIONS: FullEmulatorConnectionOptions = {
  firestore: {
      host: "127.0.0.1",
      port: 8080
  },
  storage: {
      host: "127.0.0.1",
      port: 9199
  }
}

/**
 * Merges the provided options with the default options
 * @param options Options to merge
 * @returns 
 */
export function mergeOptionsToDefault(options?: EmulatorConnectionOptions) : FullEmulatorConnectionOptions {
  const compoundedOptions = Object.assign({}, DEFAULT_EMULATOR_OPTIONS, options)
  return compoundedOptions
}