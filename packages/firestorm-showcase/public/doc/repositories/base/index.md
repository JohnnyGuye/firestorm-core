# Base repository

It justs perform the basic duties of a repository. 
It doesn't even perform any access to the DB, it just performs the actions necessary to convert a model to a document and document to a model.

Although it doesn't do much on its own, it's the backbone of all the other repositories.

If you just need the bare minimum and customize a repository to fit your need, extend it.

```ts
/**
 * Gets the type this repository work on
 */
get type(): Type<T>;
/**
 * Gets the name of the type.
 *
 * @deprecated Don't rely on its result to do stuff, the name will get mangled after compilation.
 */
protected get typeName(): string;
/**
 * The storage of metadatas of this repository
 */
protected get storage(): FirestormMetadataStorage;
/**
 * The metadatas corresponding to the type of this repository
 */
protected get typeMetadata(): FirestormMetadata<T>;
/**
 * Whether or not this repository is a subcollection or not
 */
get hasParents(): boolean | undefined;
/**
 * Gets the path to the collection of this repository
 */
get collectionPath(): string;
/**
 * Builds the path to a document
 * @param modelOrId
 * @returns
 */
pathToDocument(modelOrId: IFirestormModel | string): string;
/**
 * Converts a snapshot to a model
 * @param documentSnapshot
 * @returns
 */
firestoreDocumentSnapshotToClass(documentSnapshot: DocumentSnapshot): T;
/**
 * Converts a document to a model (if the id is not in the document, it is lost in the process)
 * @param document
 * @returns
 */
firestoreDocumentToClass(document: FirestoreDocument): T | null;
/**
 * Converts a partial model to a document
 * @param object
 * @returns
 */
classToFirestoreDocument(object: Partial<T>): FirestoreDocument;
```