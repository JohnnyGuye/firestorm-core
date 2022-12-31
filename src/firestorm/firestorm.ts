import { Type } from "@angular/core";
import { FirebaseApp, FirebaseOptions, initializeApp } from "firebase/app";
import { Firestore, getFirestore } from "firebase/firestore"
import { FirebaseStorage, getStorage } from "firebase/storage"
import { FirestormModel } from "./core/firestorm-model";
import { IParentCollection, IRepository, Repository } from "./core/repository";

/**
 * This class is the hub that enables you to connect to queries
 */
export class Firestorm {

    public readonly name: string = ""
    private app: FirebaseApp | null = null
    private _firestore: Firestore | null = null
    private _firebase: FirebaseStorage | null = null

    // private repositories = new Map<Type<any>, IRepository>() 

    /**
     * Create an instance of Firestorm.
     * It's not yet connected @see connect
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
     * Gets the repository for a model
     */
    public getRepository<T extends FirestormModel>(type: Type<T>) {
        
        let firestore = this.firestore
        if (!firestore) {
            throw new Error("You have to connect Firestorm first")
        }

        return new Repository(type, firestore)
    }

    /**
     * Gets the repository for a submodel
     * @param type Type of the submodel
     * @param parentCollections The parent collections
     * @returns 
     */
    public getSubRepository<T extends FirestormModel>(
        type: Type<T>,
        ...parentCollections: IParentCollection<any>[]
        ) {
        
        let firestore = this.firestore
        if (!firestore) {
            throw new Error("You have to connect Firestorm first")
        }

        let repository = new Repository(type, firestore, parentCollections)
        return repository
    }

    private get firestore() {
        if (!this.app) return null
        if (!this._firestore)
            this._firestore = getFirestore(this.app)

        return this._firestore
    }

    private get firebase() {
        if (!this.app) return null
        if (!this._firebase)
            this._firebase = getStorage(this.app)
        return this._firebase
    }

}