import { Type } from "./core/helpers"
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore"
import { FirebaseStorage } from "firebase/storage"
import { FirestormModel } from "./core/firestorm-model";
import { IParentCollection, BaseRepository, CrudRepository } from "./repository";

/**
 * This class is the hub that enables you to connect to queries
 */
export class Firestorm {

    public readonly name: string = ""
    private app: FirebaseApp | null = null
    private _firestore: Firestore | null = null
    // private _firebase: FirebaseStorage | null = null

    /**
     * Create an instance of Firestorm.
     * 
     * It doesn't instantly connect. You have to make a call to @see connect for that
     * @param name Name of the instance
     */
    constructor(name: string) {
        this.name = name
    }

    /**
     * Connect to the DB
     * @param options 
     * @returns 
     */
    async connect(options: FirebaseOptions) {
        this.app = initializeApp(options, this.name)
    }

    /**
     * True if this instance if connected to a firestore
     */
    get isConnected() {
        return !!this.app
    } 

    /**
     * Gets the (read-only) options of this firestorm instance.
     */
    get options() {
        return this.app?.options || null
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

    private get firestore() {
        if (!this.app) return null
        if (!this._firestore)
            this._firestore = getFirestore(this.app)

        return this._firestore
    }

    private get firebase() {
        throw new Error("Not implemented")

        // if (!this.app) return null
        // if (!this._firebase)
        //     this._firebase = getStorage(this.app)
        // return this._firebase
    }

}