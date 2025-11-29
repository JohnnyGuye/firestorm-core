import { TestGroup } from "@modules/tests";
import { ArcanaCard, Person } from "@testplans/models";
import { getFirestorm, getRunrecapRepoOfTestingPerson, getTestingPerson, UNIT_TEST_DB_ROOT } from "@testplans/utilities";
import { expect } from "@modules/tests/matcher"
import { createCollectionCrudRepositoryInstantiator } from "@jiway/firestorm-core";
import { RunRecap } from "@testplans/models/run-recap";

export default new TestGroup("Derived repositories")
    .addTest("Base",
        async () => {

            const repo = getFirestorm().getCrudRepository(ArcanaCard)            
            expect(repo.collectionPath).toEqual("arcana_cards")

        }
    )
    .addTest("Base with parent path (string)",
        async () => {

            const repo = getFirestorm().getCrudRepository(ArcanaCard, "path/away/from/root")

            const path = repo.collectionPath
            expect(path).toBe("path/away/from/root/arcana_cards")
        }
    )
    .addTest("Crud repo from single document (generic method)",
        async () => {
            const tester = getTestingPerson()
            const repo = 
                getFirestorm()
                    .getSingleDocumentCrudRepository(Person, tester.id, UNIT_TEST_DB_ROOT)
                    .getRepositoryFromFunction(
                        createCollectionCrudRepositoryInstantiator(),
                        RunRecap,
                        "."
                    )

            const expected_path = "playgrounds/unit_test/persons/__me_as_tester__/run_recaps"
            expect(repo.collectionPath).toBe(expected_path)
        }
    )
    .addTest("Crud repo from single document (specific method)",
            async () => {
            const tester = getTestingPerson()
            const expected_path = "playgrounds/unit_test/persons/__me_as_tester__/run_recaps"
            {
                const repo = 
                    getFirestorm()
                        .getSingleDocumentCrudRepository(Person, tester.id, UNIT_TEST_DB_ROOT)
                        .getCollectionCrudRepository(RunRecap, ".")
    
                expect(repo.collectionPath).toBe(expected_path)
            }

            {
                const repo = 
                    getFirestorm()
                        .getSingleDocumentCrudRepository(Person, tester.id, UNIT_TEST_DB_ROOT)
                        .getCollectionCrudRepository(RunRecap)
    
                expect(repo.collectionPath).toBe(expected_path)
            }

    })