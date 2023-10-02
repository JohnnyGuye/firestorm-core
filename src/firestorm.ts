import { Type } from "./core/helpers"
import { FirebaseApp, FirebaseOptions, getApps, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore"
import { Auth, getAuth } from "firebase/auth"
import { FirestormModel } from "./core/firestorm-model";
import { IParentCollection, BaseRepository, CrudRepository } from "./repository";

export const DEFAULT_FIREBASE_APP_NAME: string = "[DEFAULT]"

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

    // private _firebase: FirebaseStorage | null = null

    /**
     * Create an instance of Firestorm.
     * 
     * It doesn't instantly connect. You have to make a call to @see connect for that
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
        let app = getApps().find(app => app.name == this.name) 
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
     * @param type Type of the model
     * @param parentCollections 
     * @returns 
     */
    public getCrudRepository<T extends FirestormModel>(type: Type<T>, ...parentCollections: IParentCollection<any>[]) {
        return this.getRepository(CrudRepository<T>, type, ...parentCollections)
    }

    /**
     * Gets the repository for a model
     * @param type Type of the model
     * @returns 
     */
    public getRepository<R extends BaseRepository<T>, T extends FirestormModel>(
        repositoryType: Type<R>,
        type: Type<T>
        ): R;
    /**
     * Gets the repository for a submodel
     * @param type Type of the submodel
     * @param parentCollections The parent collections
     * @returns 
     */
    public getRepository<R extends BaseRepository<T>, T extends FirestormModel>(
        repositoryType: Type<R>,
        type: Type<T>,
        ...parentCollections: IParentCollection<any>[]
        ): R;
    public getRepository<R extends BaseRepository<T>, T extends FirestormModel>(
        repositoryType: Type<R>,
        type: Type<T>,
        ...parentCollections: IParentCollection<any>[]
        ): R {
        
        let firestore = this.firestore
        if (!firestore) {
            throw new Error("You have to connect Firestorm first")
        }

        let repository = new repositoryType(type, firestore, parentCollections)
        return repository
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

}