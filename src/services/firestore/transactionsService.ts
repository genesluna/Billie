import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

import { Transaction } from "../../models/Transaction";

/**
 * Retrieves the Firestore collection reference for user transactions.
 *
 * @param userId - The unique identifier of the user.
 *
 * @returns A Firestore collection reference to the user's transactions collection.
 */
function transactionsCollection(userId: string): FirebaseFirestoreTypes.CollectionReference<Transaction> {
  return firestore().collection(
    `users/${userId}/transactions`
  ) as FirebaseFirestoreTypes.CollectionReference<Transaction>;
}

/**
 * Adds a new transaction to the user's transactions collection.
 *
 * @param transaction - The transaction object to be added.
 * @param userId - The unique identifier of the user.
 *
 * @returns A promise that resolves when the transaction is successfully added.
 */
export function addTransaction(transaction: Transaction, userId: string) {
  return transactionsCollection(userId).add({
    ...transaction,
  });
}

/**
 * Updates an existing transaction in the user's transactions collection.
 *
 * @param transaction - The updated transaction object.
 * @param userId - The unique identifier of the user.
 *
 * @returns A promise that resolves when the transaction is successfully updated.
 */
export function updateTransaction(transaction: Transaction, userId: string) {
  return transactionsCollection(userId)
    .doc(transaction.Id)
    .update({
      ...transaction,
    });
}

/**
 * Deletes a transaction from the user's transactions collection.
 *
 * @param transactionId - The unique identifier of the transaction to be deleted.
 * @param userId - The unique identifier of the user.
 *
 * @returns A promise that resolves when the transaction is successfully deleted.
 */
export function deleteTransaction(transactionId: string, userId: string) {
  return transactionsCollection(userId).doc(transactionId).delete();
}

/**
 * Retrieves all user transactions ordered by date in ascending order.
 *
 * @param userId - The unique identifier of the user.
 *
 * @returns A promise that resolves to an array of user transactions.
 */
export async function getUserTransactions(userId: string) {
  return await transactionsCollection(userId)
    .orderBy("date", "asc")
    .get()
    .then((snapshot) => {
      if (snapshot.empty) return [] as Transaction[];
      return snapshot.docs.map((doc) => {
        doc.data().date = (doc.data().date as unknown as FirebaseFirestoreTypes.Timestamp).toDate();
        doc.data().Id = doc.id;
        return doc.data();
      });
    });
}

/**
 * Retrieves the oldest transaction date of the user.
 *
 * @param userId - The unique identifier of the user.
 *
 * @returns A promise that resolves to the oldest transaction date of the user.
 */
export async function getOldestUserTransactionDate(userId: string) {
  return await transactionsCollection(userId)
    .orderBy("date", "asc")
    .limit(1)
    .get()
    .then((snapshot) => (snapshot.docs[0]?.data().date as unknown as FirebaseFirestoreTypes.Timestamp)?.toDate());
}

/**
 * Retrieves the user transactions for the current month.
 *
 * @param userId - The unique identifier of the user.
 *
 * @returns A promise that resolves to an array of user transactions for the current month.
 */
export async function getCurrentMonthUserTransactions(userId: string) {
  const now = new Date();
  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

  return await transactionsCollection(userId)
    .where("date", ">=", firstDay)
    .where("date", "<=", lastDay)
    .orderBy("date", "desc")
    .get()
    .then((snapshot) => {
      if (snapshot.empty) return [] as Transaction[];
      return snapshot.docs.map((doc) => {
        doc.data().date = (doc.data().date as unknown as FirebaseFirestoreTypes.Timestamp).toDate();
        doc.data().Id = doc.id;
        return doc.data();
      });
    });
}

/**
 * Retrieves the user transactions for a specific month and year.
 *
 * @param userId - The unique identifier of the user.
 * @param month - The month (0-indexed) for which to retrieve transactions.
 * @param year - The year for which to retrieve transactions.
 *
 * @returns A promise that resolves to an array of user transactions for the specified month and year.
 */
export async function getUserTransactionsByMonthAndYear(userId: string, month: number, year: number) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0, 23, 59, 59, 999);

  return await transactionsCollection(userId)
    .where("date", ">=", firstDay)
    .where("date", "<=", lastDay)
    .orderBy("date", "desc")
    .get()
    .then((snapshot) => {
      if (snapshot.empty) return [] as Transaction[];
      return snapshot.docs.map((doc) => {
        doc.data().date = (doc.data().date as unknown as FirebaseFirestoreTypes.Timestamp).toDate();
        doc.data().Id = doc.id;
        return doc.data();
      });
    });
}
