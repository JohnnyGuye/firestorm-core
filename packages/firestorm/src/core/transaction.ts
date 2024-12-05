import { Transaction } from "firebase/firestore";

export type TransactionFnc = (transaction: Transaction) => Promise<void>