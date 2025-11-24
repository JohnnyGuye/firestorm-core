import { TestGroup } from "@modules/tests";
import { PackageInfosEntity } from "@testplans/models";
import { getFirestorm, UNIT_TEST_DB_ROOT } from "@testplans/utilities";
import { expect } from "@modules/tests/matcher"

function getFirestormSingleDocumentRepo() {
    return getFirestorm().getSingleDocumentCrudRepository(PackageInfosEntity, "firestorm", UNIT_TEST_DB_ROOT)
}

function defaultPackageInfo() {
    const pie = new PackageInfosEntity()
    
    pie.name = "FirestORM"
    pie.description = "FirestORM is a wrapper ORM around firestore"
    pie.version = "0.0.999"

    return pie
}

export default new TestGroup("CRUD Document repo")
    .addBeforeAllTest(async () => {


    })
    .addBeforeEachTest(async () => {

        const repo = getFirestormSingleDocumentRepo()
        await repo.deleteAsync()

    })
    .addTest("Non existency",
        async () => {

            const repo = getFirestormSingleDocumentRepo()

            const exist = await repo.existsAsync()
            expect(exist).toBeFalse()

        }
    )
    .addTest("Void read",
        async () => {

            const repo = getFirestormSingleDocumentRepo()

            const config = await repo.getAsync()

            expect(config).toBeNull()

        }
    )
    .addTest("Create (write)",
        async () => {

            const repo = getFirestormSingleDocumentRepo()

            const pie = defaultPackageInfo()
            await repo.writeAsync(pie)

            const testPie = defaultPackageInfo()
            testPie.id = repo.documentId

            expect(pie).toBe(testPie)

        }
    )
    .addTest("Update (write)",
        async () => {

            const repo = getFirestormSingleDocumentRepo()

            const new_version = "0.1.0"
            const pie = defaultPackageInfo()
            await repo.writeAsync(pie)

            const testPie1 = defaultPackageInfo()
            testPie1.id = repo.documentId

            expect(pie).toBe(testPie1)

            pie.version = new_version

            await repo.writeAsync(pie)

            const testPie2 = defaultPackageInfo()
            testPie2.id = repo.documentId
            testPie2.version = new_version

            expect(pie).toBe(testPie2)

        }
    )
    .addTest("Update (update)",
        async () => {

            const repo = getFirestormSingleDocumentRepo()

            
            const pie = defaultPackageInfo()
            expect(async () => {
                await repo.updateAsync(pie)
            }).toThrowAsync()

            {
                await repo.writeAsync(pie)
    
                const testPie1 = defaultPackageInfo()
                testPie1.id = repo.documentId
    
                expect(pie).toBe(testPie1)

            }
            
            {

                const new_version = "0.1.0"
                pie.version = new_version
    
                await repo.updateAsync(pie)
    
                const testPie2 = defaultPackageInfo()
                testPie2.id = repo.documentId
                testPie2.version = new_version
    
                expect(pie).toBe(testPie2)

            }

            {
                const new_version = "0.1.1"

                await repo.updateAsync({ version: new_version })

                const finalPie = await repo.getAsync()

                const testPie3 = defaultPackageInfo()
                testPie3.id = repo.documentId
                testPie3.version = new_version
                
                expect(finalPie).toBe(testPie3)

            }

        }
    )
    .addTest("Delete",
        async () => {

            const repo = getFirestormSingleDocumentRepo()

            let originPie = await repo.getAsync()
            expect(originPie).toBeNull()

            const pie = defaultPackageInfo()
            await repo.writeAsync(pie)
            
            let fetchedPie = await repo.getAsync()
            expect(fetchedPie).toNotBeNull()

            await repo.deleteAsync()

            let finalPie = await repo.getAsync()
            expect(finalPie).toBeNull()

        }
    )