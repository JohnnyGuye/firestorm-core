import { 
  EmulatorMockTokenOptions as FirestoreEmulatorMockTokenOptions} from "firebase/firestore"
import { 
  EmulatorMockTokenOptions as StorageEmulatorMockTokenOptions} from "firebase/storage"

export interface BaseEmulatorConnectionOptions {
  readonly host: string
  readonly port: number
}

export interface FirestoreEmulatorConnectionOptions extends BaseEmulatorConnectionOptions {
  readonly mockUserToken?: FirestoreEmulatorMockTokenOptions | string | undefined
}

export interface StoreEmulatorConnectionOptions extends BaseEmulatorConnectionOptions {
  readonly mockUserToken?: StorageEmulatorMockTokenOptions | string | undefined
}

// const DEFAULT_EMULATOR_OPTIONS: Readonly<Pick<FirestoreEmulatorConnectionOptions, 'host' | 'port'>> = {
//     host: "127.0.0.1",
//     port: 8080
// }

export interface EmulatorConnectionOptions {
  readonly firestore?: FirestoreEmulatorConnectionOptions
  readonly storage?: StoreEmulatorConnectionOptions
}

export interface FullEmulatorConnectionOptions extends EmulatorConnectionOptions {
  firestore: Readonly<FirestoreEmulatorConnectionOptions>
  storage: Readonly<StoreEmulatorConnectionOptions>
}

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

export function mergeOptionsToDefault(options?: EmulatorConnectionOptions) : FullEmulatorConnectionOptions {
  const compoundedOptions = Object.assign({}, DEFAULT_EMULATOR_OPTIONS, options)
  return compoundedOptions
}