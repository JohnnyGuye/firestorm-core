import { Type } from "./core/helpers"
import { IFirestormModel } from "./core/firestorm-model";
import { IParentCollectionOptions, BaseRepository, CrudRepository } from "./repositories";

import { FirebaseApp, FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { 
    Firestore, 
    getFirestore, 
    connectFirestoreEmulator 
} from "firebase/firestore"
import { 
    FirebaseStorage, 
    connectStorageEmulator, 
    getStorage 
} from "firebase/storage"
import { Auth, getAuth } from "firebase/auth"
import { StorageRepository } from "./storage";
import { SingleDocumentRepository } from "./repositories/single-document-crud-repository";
import { EmulatorConnectionOptions, mergeOptionsToDefault } from "./emulator";

export const DEFAULT_FIREBASE_APP_NAME: string = "[DEFAULT]"
export { DEFAULT_EMULATOR_OPTIONS } from "./emulator"

class MissingAppError extends Error {

    constructor() { super("[Firestorm] You must connect firestorm first.") }
}


/**
 * This class is the hub that enables you to connect to queries
 */
export class Firestorm {

    public readonly name: string = ""
    private _app: FirebaseApp | null = null
    private _firestore: Firestore | null = null
    private _auth: Auth | null = null
    private _storage: FirebaseStorage | null = null

    /**
     * Create an instance of Firestorm.
     * 
     * It doesn't instantly connect. You have to make a call to {@link connect} for that
     * @param name Name of the instance
     */
    constructor(name?: string) {
        this.name = name || DEFAULT_FIREBASE_APP_NAME
    }

    /**
     * Connect to the DB.
     * 
     * If an app with the same name already exists, it will use that.
     * Otherwise it will create a new instance using the options.
     * @throws if no previous app of the same name and no options provided
     * @param options Options to create the app
     * @returns 
     */
    connect(options?: FirebaseOptions) {
        const app = getApps().find(app => app.name == this.name) 
        if (app) {
            this._app = app
            return
        }

        if (!options) {
            throw new Error("Tried to create the firebase app but no options where provided.")
        }
        this._app = initializeApp(options, this.name)
    }

    /**
     * Call this after connecting to use the emulator instead of the database.
     * @param options Connection options. Defaults to {@link DEFAULT_EMULATOR_OPTIONS}
     */
    useEmulator(options?: EmulatorConnectionOptions) {

        const opt = mergeOptionsToDefault(options)
        const firestoreOpt = opt.firestore
        connectFirestoreEmulator(this.firestore, firestoreOpt.host, firestoreOpt.port)

        const storageOpt = opt.storage
        connectStorageEmulator(this.storage, storageOpt.host, storageOpt.port)
    }

    /**
     * True if this instance if connected to a firestore
     */
    get isConnected() {
        return !!this._app
    } 

    /**
     * Gets the (read-only) options of this firestorm instance.
     */
    get options() {
        return this._app?.options || null
    }

    /**
     * The underlying firebase app
     */
    get app() {
        return this._app
    }

    /**
     * Gets the basic CRUD repository for a model
     * @template T Type of the model
     * @param type Type of the model
     * @param parentCollections 
     * @returns 
     */
    public getCrudRepository<T extends IFirestormModel>(
        type: Type<T>, 
        ...parentCollections: IParentCollectionOptions<IFirestormModel>[]
        ) {
        return this.getRepository(CrudRepository<T>, type, ...parentCollections)
    }

    /**
     * Gets the mono document CRUD repository for a model
     * @param type Type of the document model
     * @param parentCollections The parent collections
     * @param documentId Id of the document
     * @returns 
     */
    public getSingleDocumentCrudRepository<T extends IFirestormModel>(
        type: Type<T>, 
        documentId: string,
        ...parentCollections: IParentCollectionOptions<IFirestormModel>[]
        ) {
        const repo = this.getRepository(SingleDocumentRepository<T>, type, ...parentCollections)
        repo.documentId = documentId
        return repo
    }

    /**
     * Gets the repository for a model
     * @param type Type of the model
     * @returns 
     */
    public getRepository<R extends BaseRepository<T>, T extends IFirestormModel>(
        repositoryType: Type<R>,
        type: Type<T>
        ): R;
    /**
     * Gets the repository for a submodel
     * @param type Type of the submodel
     * @param parentCollections The parent collections
     * @returns 
     */
    public getRepository<R extends BaseRepository<T>, T extends IFirestormModel>(
        repositoryType: Type<R>,
        type: Type<T>,
        ...parentCollections: IParentCollectionOptions<IFirestormModel>[]
        ): R;
    public getRepository<R extends BaseRepository<T>, T extends IFirestormModel>(
        repositoryType: Type<R>,
        type: Type<T>,
        ...parentCollections: IParentCollectionOptions<IFirestormModel>[]
        ): R {
        
        return new repositoryType(type, this.firestore, parentCollections)
    }

    /**
     * Gets a storage repository
     * @returns 
     */
    public getStorageRepository() {
        return new StorageRepository(this.storage)
    }

    /**
     * The instance of firestorm
     */
    public get firestore() {
        if (!this._app) throw new MissingAppError()

        if (!this._firestore)
            this._firestore = getFirestore(this._app)

        return this._firestore
    }

    /**
     * The instance of auth
     */
    public get auth() {
        if (!this._app) throw new MissingAppError()

        if (!this._auth)
            this._auth = getAuth(this._app)
        return this._auth
    }

    /**
     * The instance of storage
     */
    public get storage() {
        if (!this._app) throw new MissingAppError()

        if (!this._storage)
            this._storage = getStorage(this._app)
        
        return this._storage
    }

}