import { Firestorm } from "../src"
import { Conversation } from "./models"
import { VALID_FIREBASE_CONFIG } from "./utility"

describe("Ladadim", () => {
    
    const firestorm = new Firestorm()
    const rootCollection = ["playgrounds", "message_app"]

    beforeAll(() => {
        firestorm.connect(VALID_FIREBASE_CONFIG)
        firestorm.useEmulator()
    })

    afterEach(async () => {
        const conversationRepo = firestorm.getCrudRepository(Conversation, rootCollection)
        await conversationRepo.deleteAllAsync()
    })

    it("Insertion test", async () => {
        const conversationRepo = firestorm.getCrudRepository(Conversation, rootCollection)

        const conv = new Conversation()
        
        expect(conv.id).toBeFalsy()

        await conversationRepo.createAsync(conv)
        
        expect(conv.id).toBeTruthy()
    })

    it("Insert multiple test", async () => {
        const conversationRepo = firestorm.getCrudRepository(Conversation, rootCollection)

        const convs = []
        for (let i = 0; i < 5; i++) {
            convs.push(new Conversation())
        }

        await conversationRepo.createMultipleAsync(...convs)

        const retrievedConvs = await conversationRepo.getAllAsync()
        expect(retrievedConvs.length).toBe(5)
    })
    
})