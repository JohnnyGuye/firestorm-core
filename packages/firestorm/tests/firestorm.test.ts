import { deleteApp, getApps, initializeApp } from "firebase/app";
import { Firestorm } from "../src";

const VALID_FIREBASE_CONFIG = {
    apiKey: "AIzaSyCfaBZURn4YqXagb4Ke1Y7GKsx08ePy-MA",
    authDomain: "firestorm-59ba4.firebaseapp.com",
    projectId: "firestorm-59ba4",
    storageBucket: "firestorm-59ba4.firebasestorage.app",
    messagingSenderId: "96063317523",
    appId: "1:96063317523:web:cdc84f40c440b00f3101e6",
    measurementId: "G-SD5QL1MT4K"
}

describe('Firestorm instanciation', () => {

    afterEach(() => {
        for (let app of getApps()) {
            deleteApp(app)
        }
    })
    
    it("Default name", () => {
        const f = new Firestorm()  
        expect(f.name).toBe('[DEFAULT]');
    })

    it("Multi instance", () => {
        const f1 = new Firestorm("Instance 1")  
        const f2 = new Firestorm("Instance 2")  
        expect(f1.name).toBe('Instance 1');
        expect(f2.name).toBe('Instance 2');
    })

    it("Throw when connecting without options and no previous app of the same name", () => {
        const f = new Firestorm()
        expect(() => {
            f.connect()
        }).toThrow()
    })

    it("Correctly connects with options", () => {
        const f = new Firestorm()
        f.connect(VALID_FIREBASE_CONFIG)
    })

    it("Correctly connects without options but with previously instanciated app (default)", () => {
        const f = new Firestorm()
        f.connect(VALID_FIREBASE_CONFIG)

        const fTest = new Firestorm()
        fTest.connect()

        expect(f.options?.apiKey).toBe(fTest.options?.apiKey)
    })

    it("Correctly connects without options but with previously instanciated app (custom name)", () => {

        const f = new Firestorm("Custom")
        f.connect(VALID_FIREBASE_CONFIG)

        const fTest = new Firestorm("Custom")
        fTest.connect()

        expect(f.options?.apiKey).toBe(fTest.options?.apiKey)
    })

    it("Instantiate firestorm around an app created directly with firebase", () => {
        initializeApp(VALID_FIREBASE_CONFIG, "Native instance")

        expect(() => {
            const f = new Firestorm()
            f.connect()
        }).toThrow()

        const f = new Firestorm("Native instance")
        f.connect()
    })

    it("Connects to emulators", () => {
        const f = new Firestorm()
        f.connect(VALID_FIREBASE_CONFIG)
        f.useEmulator()
    })
    

})