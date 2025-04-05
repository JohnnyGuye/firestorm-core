import { Firestorm } from "../src"
import { Conversation } from "./models"
import { VALID_FIREBASE_CONFIG } from "./utility"

describe("Ladadim", () => {
    
    const firestorm = new Firestorm()

    beforeAll(() => {
        firestorm.connect(VALID_FIREBASE_CONFIG)
        firestorm.useEmulator()
    })

    afterEach(async () => {
        const conversationRepo = firestorm.getCrudRepository(Conversation)
        await conversationRepo.deleteAllAsync()
    })

    it("Insertion test", async () => {
        const conversationRepo = firestorm.getCrudRepository(Conversation)

        const conv = new Conversation()
        
        expect(conv.id).toBeFalsy()

        await conversationRepo.createAsync(conv)
        
        expect(conv.id).toBeTruthy()

    })
    
})