# Single document repository

This repository exists to manipulate a single precise document in your DB.
It can be used for things like auto completion base on a in-DB list, lock state, temporary redirections,...

You must provide a document id to the repository and it will always work with this document disregarding the id in the model.

```ts
/**
 * Writes a new item in the databse.
 *
 * The id is ignored in the model and set to this.documentId
 *
 * @param model Model to store
 * @returns
 */
writeAsync(model: T): Promise<T>;
/**
 * Modifies the item in the database.
 *
 * The id, if provided, is ignored in the model and set to this.documentId
 *
 * @param model Partial or full model to update. It must have an id.
 * @returns A Promise that resolved when the item has been updated
 */
updateAsync(model: Partial<T>): Promise<void>;
/**
 * Gets the document of this repository
 *
 * @returns A promise containing either the item retrieved or null if it doesn't exist
 */
getAsync(): Promise<T | null>;
/**
 * Check if the document exists in the database
 *
 * If you need to use the document later in the process, {@link getAsync} is a better fit
 * @returns
 */
existsAsync(): Promise<boolean>;
```