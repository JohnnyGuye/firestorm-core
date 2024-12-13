import { FirestormModel, IdModelDictionary } from "../../core/firestorm-model"

/**
 * Explicit interface for subcollections.
 * 
 * Use it in conjonctions with the decorator SubCollection for clean type checking.
 */
export type SubCollection<T extends FirestormModel> = T | IdModelDictionary<T> | T[]