# CRUD repository

The CRUD repository provides the basic set of Create-Read-Update-Delete options.

```ts
/**
 * Creates a new item in the database.
 *
 * Not providing an id in the item auto generates an id.
 *
 * If an item with the same id is already present it will override it destructively
 * (the entire document will be replaced in database)
 *
 * @param model
 * @returns A promise that resolved when and on the item that has been created.
 */
createAsync(model: T): Promise<T>;
/**
 * Modifies an item in the database.
 * @param model Partial or full model to update. It must have an id.
 * @returns A Promise that resolved when the item has been updated
 */
updateAsync(model: Partial<T> & IMandatoryFirestormModel): Promise<void>;
/**
 * Tries to find an item by its id in the database
 * @param id Id of the item to find
 * @returns A promise containing either the item retrieved or null if not found
 */
findByIdAsync(id: string): Promise<T | null>;
/**
 * Check if a document with this id already exists in the database
 * @see findByIdAsync It's doing findById under the hood so it's almost always preferable to use the other. It's just a convenience
 * @param id Id of the item to check the existency
 * @returns A promise returning true if an item with this id exists in the collection
 */
existsAsync(id: string): Promise<boolean>;
/**
 * Queries a collection of items
 * @param firestoryQuery Query
 * @returns A promise on the items that are results of the query
 */
queryAsync(firestoryQuery: Query | IQueryBuildBlock): Promise<T[]>;
/**
 * Gets a random item in the whole collection.
 *
 * It relies on the presence of the field "id" in the document so it won't work if that is not the case.
 * @returns A random element of the collection or null if no elements.
 */
getRandomAsync(): Promise<T | null>;
/**
 * Gets all the items of a collection
 * @returns A promise containing all the items in the collection
 */
findAllAsync(): Promise<T[]>;
/**
 * Deletes a document in the database.
 * It doesn't delete its subcollection if any.
 *
 * Trying to delete a document that doesn't exist will just silently fail
 *
 * @param id Id of the document to delete
 * @returns A promise that returns when the document has been deleted
 */
deleteAsync(id: string): Promise<void>;
/**
 * Deletes a document in the database.
 * It doesn't delete its subcollection if any.
 *
 * Trying to delete a document that doesn't exist will just silently fail
 *
 * This doesn't typecheck the model. It only types check that you provided an id
 *
 * @param model Model of the document to delete.
 * @returns A promise that returns when the document has been deleted
 */
deleteAsync(model: IFirestormModel): Promise<void>;

```
