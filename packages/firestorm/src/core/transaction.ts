import { Transaction } from "firebase/firestore";

/**
 * Type for functions passed to firebase's runTransaction
 * @param transaction Firestore transaction
 */
export type TransactionFnc = (transaction: Transaction) => Promise<void>