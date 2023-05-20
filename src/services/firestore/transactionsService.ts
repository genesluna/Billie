import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

import { Transaction } from "../../models/Transaction";

function transactionsCollection(userId: string): FirebaseFirestoreTypes.CollectionReference<Transaction> {
  return firestore().collection(
    `users/${userId}/transactions`
  ) as FirebaseFirestoreTypes.CollectionReference<Transaction>;
}

export function addTransaction(transaction: Transaction, userId: string) {
  return transactionsCollection(userId).add({
    ...transaction,
  });
}

export function updateTransaction(transaction: Transaction, userId: string) {
  return transactionsCollection(userId)
    .doc(transaction.Id)
    .update({
      ...transaction,
    });
}

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

export async function getOldestUserTransactionDate(userId: string) {
  return await transactionsCollection(userId)
    .orderBy("date", "asc")
    .limit(1)
    .get()
    .then((snapshot) => (snapshot.docs[0]?.data().date as unknown as FirebaseFirestoreTypes.Timestamp)?.toDate());
}

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

export async function getUserTransactionsByMonthAndYear(userId: string, month: number, year: number) {
  const now = new Date();

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
