import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { Transaction } from "../../models/Transaction";

export const trasactionsCollection = firestore().collection(
  "transactions"
) as FirebaseFirestoreTypes.CollectionReference<Transaction>;

export function addTransaction(transaction: Transaction) {
  return trasactionsCollection.add({
    ...transaction,
  });
}

export function updateTransaction(transaction: Transaction) {
  return trasactionsCollection.add({
    ...transaction,
  });
}

export async function getUserTransactions(userId: string) {
  return await trasactionsCollection
    .where("userId", "==", userId)
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
  return await trasactionsCollection
    .where("userId", "==", userId)
    .orderBy("date", "asc")
    .limit(1)
    .get()
    .then((snapshot) => (snapshot.docs[0]?.data().date as unknown as FirebaseFirestoreTypes.Timestamp)?.toDate());
}

export async function getCurrentMonthUserTransactions(userId: string) {
  const now = new Date();

  const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);

  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return await trasactionsCollection
    .where("userId", "==", userId)
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

  const lastDay = new Date(year, month + 1, 0);

  return await trasactionsCollection
    .where("userId", "==", userId)
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
