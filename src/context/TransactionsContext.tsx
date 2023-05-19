import { useContext, useState, useEffect, ReactNode, createContext } from "react";
import { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";
import { Transaction } from "../models/Transaction";
import { useAuth } from "./AuthContext";
import {
  addTransaction,
  updateTransaction,
  getCurrentMonthUserTransactions,
  getOldestUserTransactionDate,
  getUserTransactionsByMonthAndYear,
} from "../services/firestore/transactionsService";

type AuthContextProps = {
  children: ReactNode;
};

type TransactionsContextType = {
  isLoading: boolean;
  transactions: Transaction[];
  oldestTransactionDate: Date | undefined;
  addTransaction: (transaction: Transaction) => Promise<FirebaseFirestoreTypes.DocumentReference<Transaction>>;
  updateTransaction: (transaction: Transaction) => Promise<FirebaseFirestoreTypes.DocumentReference<Transaction>>;
  handlePreviousAndNextMonthTransactions(month: number, year: number): Promise<void>;
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
  const [isLoading, setIsloading] = useState<boolean>(true);
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
        setIsloading(false);
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
      setIsloading(true);
      const result = await getUserTransactionsByMonthAndYear(authUser?.uid!, month, year);
      setTransactions(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
  }

  const values: TransactionsContextType = {
    isLoading,
    transactions,
    oldestTransactionDate,
    addTransaction,
    updateTransaction,
    handlePreviousAndNextMonthTransactions,
  };

  return <TransactionsContext.Provider value={values}>{children}</TransactionsContext.Provider>;
}
