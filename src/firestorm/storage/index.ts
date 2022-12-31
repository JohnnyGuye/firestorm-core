import { FirestormMetadataStorage } from "../core/firestorm-metadata-storage";

/**
 * The global instance storage of metadatas. 
 * Every metadatas necessary for firestom to work is stored here.
 */
export const FIRESTORM_METADATA_STORAGE = new FirestormMetadataStorage()