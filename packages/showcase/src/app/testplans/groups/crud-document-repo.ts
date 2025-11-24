import { TestGroup } from "@modules/tests";
import { PackageInfosEntity } from "@testplans/models";
import { getFirestorm } from "@testplans/utilities";

function getFirestormSingleDocumentRepo() {
    return getFirestorm().getSingleDocumentCrudRepository(PackageInfosEntity, "firestorm")
}

export default new TestGroup("CRUD Document repo")
    .addBeforeAllTest(async () => {


    })
    .addBeforeEachTest(async () => {
        const repo = getFirestormSingleDocumentRepo()
        await repo.deleteAsync()
    }
    .addTest("Create",
        async () => {

            const repo = getFirestormSingleDocumentRepo()

            await repo.existsAsync
        }
    )