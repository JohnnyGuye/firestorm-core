import { Transaction } from "firebase/firestore";

/**
 * Type for functions passed to firebase's runTransaction
 */
export type TransactionFnc = (transaction: Transaction) => Promise<void>