import { useContext, useState, useEffect, ReactNode, createContext } from "react";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

import { sortTransactionsByDate } from "../utils/transactionsUtils";
import { Transaction } from "../models/Transaction";
import { useAuth } from "./AuthContext";
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  getCurrentMonthUserTransactions,
  getOldestUserTransactionDate,
  getUserTransactionsByMonthAndYear,
} from "../services/firestore/transactionsService";

type AuthContextProps = {
  children: ReactNode;
};

type TransactionsContextType = {
  oldestTransactionDate: Date | undefined;
  transactions: Transaction[];
  isLoading: boolean;
  handlePreviousAndNextMonthTransactions(month: number, year: number): Promise<void>;
  updateTransaction: (transaction: Transaction, userId: string) => Promise<void>;
  deleteTransaction: (transactionId: string, userId: string) => Promise<void>;
  updateItemInCurrentMonthTransactions(transaction: Transaction): void;
  deleteItemFromCurrentMonthTransactions(transactionID: string): void;
  addItemToCurrentMonthTransactions(transaction: Transaction): void;
  addTransaction: (
    transaction: Transaction,
    userId: string
  ) => Promise<FirebaseFirestoreTypes.DocumentReference<Transaction>>;
};

/**
 * The transactions context object that is passed down through the component tree.
 */
const TransactionsContext = createContext<TransactionsContextType>({} as TransactionsContextType);

/**
 * A hook that returns the transactions context.
 *
 * @returns An object containing the transactions object and the transactions functions.
 */
export function useTransactions() {
  return useContext(TransactionsContext);
}

/**
 * Provides transactions context for the app.
 *
 * @param children - ReactNode representing the child components to be rendered within the provider.
 * @returns A component that wraps the app with a transactions context.
 */
export function TransactionsProvider({ children }: AuthContextProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([] as Transaction[]);
  const [oldestTransactionDate, setOldestTransactionDate] = useState<Date | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { authUser } = useAuth();

  // Fetch transactions and oldest transaction date
  useEffect(() => {
    const getTrasactions = async () => {
      try {
        const transactionsResult = await getCurrentMonthUserTransactions(authUser?.uid!);
        const oldestTransactionDateResult = await getOldestUserTransactionDate(authUser?.uid!);
        setOldestTransactionDate(oldestTransactionDateResult);
        setTransactions(transactionsResult);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };

    getTrasactions();
  }, []);

  /**
   * Handle fetching transactions for a specific month and year
   *
   * @param month - The month (1-12) for which transactions should be fetched.
   * @param year - The year for which transactions should be fetched.
   *
   * @returns - A promise that resolves when the transactions are fetched and updated.
   */
  async function handlePreviousAndNextMonthTransactions(month: number, year: number): Promise<void> {
    try {
      setIsLoading(true);
      const result = await getUserTransactionsByMonthAndYear(authUser?.uid!, month, year);
      setTransactions(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * Adds a transaction to the current month's transactions.
   * If the user is in the current month screen, the transaction is added directly and the transactions are sorted by date in descending order.
   * If the user is not in the current month screen, the transaction is added to the current month's transactions and sorted by date in descending order.
   *
   * @param transaction - The transaction to be added.
   */
  function addItemToCurrentMonthTransactions(transaction: Transaction) {
    setIsLoading(true);

    /**
     * Processes the transaction by adding it to the transactions array and sorting the transactions by date in descending order.
     *
     * @param transaction - The transaction to be processed.
     */
    const processTransaction = (transaction: Transaction) => {
      if (!transactions[0]) {
        setTransactions([transaction]);
      } else {
        transactions.push(transaction);
        const sorted = sortTransactionsByDate<Transaction>(transactions, "desc");
        setTransactions(sorted);
      }
    };

    // Handle the scenario where the user is in the current month screen and adds a new transaction
    if (
      transaction.date.getFullYear() === new Date().getFullYear() &&
      transaction.date.getMonth() === new Date().getMonth()
    ) {
      processTransaction(transaction);
    }
    // Handle the scenario where the user is not in the current month screen and adds a new transaction
    else if (
      transactions[0] &&
      transaction.date.getFullYear() === transactions[0].date.getFullYear() &&
      transaction.date.getMonth() === transactions[0].date.getMonth()
    ) {
      processTransaction(transaction);
    }

    if (oldestTransactionDate) {
      if (
        transaction.date.getMonth() < oldestTransactionDate.getMonth() ||
        transaction.date.getFullYear() < oldestTransactionDate.getFullYear()
      ) {
        setOldestTransactionDate(transaction.date);
      }
    } else {
      setOldestTransactionDate(transaction.date);
    }

    setIsLoading(false);
  }

  /**
   * Updates a transaction in the current month's transactions.
   *
   * @param transaction - The updated transaction to replace the existing one.
   */
  function updateItemInCurrentMonthTransactions(transaction: Transaction) {
    setIsLoading(true);
    const oldTransIndex = transactions.findIndex((obj) => obj.Id === transaction.Id);
    transactions[oldTransIndex] = transaction;
    setIsLoading(false);
  }

  /**
   * Deletes a transaction in the current month's transactions.
   *
   * @param transactionId - The Id of the transaction to be deleted.
   */
  function deleteItemFromCurrentMonthTransactions(transactionId: String) {
    setIsLoading(true);
    const transactionIndex = transactions.findIndex((obj) => obj.Id === transactionId);
    const transactionDate = transactions[transactionIndex].date;
    transactions.splice(transactionIndex, 1);

    if (transactionDate === oldestTransactionDate) {
      // TODO: Handle the scenario where the user deletes the oldest transaction
    }
    setIsLoading(false);
  }

  const values: TransactionsContextType = {
    oldestTransactionDate,
    transactions,
    isLoading,
    deleteItemFromCurrentMonthTransactions,
    handlePreviousAndNextMonthTransactions,
    updateItemInCurrentMonthTransactions,
    addItemToCurrentMonthTransactions,
    updateTransaction,
    deleteTransaction,
    addTransaction,
  };

  return <TransactionsContext.Provider value={values}>{children}</TransactionsContext.Provider>;
}
