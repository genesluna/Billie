import { Category } from "../models/Category";
import { Transaction } from "../models/Transaction";

/**
 * Array of month names in Portuguese.
 */
export const months: string[] = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

/**
 * Formats a given date into the "DD/MM/YYYY" format.
 *
 * @param data The date to be formatted.
 *
 * @returns The formatted date string.
 */
export function formatDate(data: Date): string {
  const day = String(data.getDate()).padStart(2, "0");
  const month = String(data.getMonth() + 1).padStart(2, "0");
  const year = String(data.getFullYear());

  return `${day}/${month}/${year}`;
}

/**
 * Sorts an array of transactions by date in ascending order.
 *
 * @param transactions The array of transactions to be sorted.
 *
 * @returns The sorted array of transactions.
 */
export function sortTransactionsByDate<T>(transactions: any[]): T[] {
  const sortedTransactions = transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return sortedTransactions;
}

/**
 * Filters an array of transactions to include only those from the current month and year.
 *
 * @param transactions The array of transactions to be filtered.
 *
 * @returns The filtered array of transactions.
 */
export function filterTransactionsByCurrentMonthYear<T>(transactions: any[]): T[] {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    const transactionYear = transactionDate.getFullYear();
    const transactionMonth = transactionDate.getMonth();

    return transactionYear === currentYear && transactionMonth === currentMonth;
  });

  return filteredTransactions;
}

/**
 * Sums the amount fields of transactions based on the given transaction type.
 *
 * @param transactions The array of transactions.
 * @param transactionType The transaction type to filter by.
 *
 * @returns The total amount of transactions for the given transaction type.
 */
export function sumAmountByTransactionType(transactions: Transaction[], transactionType: string): number {
  const filteredTransactions = transactions.filter((transaction) => transaction.type === transactionType);
  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return totalAmount;
}

/**
 * Calculates the total amounts grouped by category for an array of transactions.
 *
 * @param transactions An array of transactions to calculate totals from.
 *
 * @returns An array of categories with their respective totals.
 */
export function sumAmountsByCategory(transactions: Transaction[]): Category[] {
  const categories: { [name: string]: Category } = {};

  transactions.forEach((transaction) => {
    const { category, amount, type } = transaction;
    const categoryName = category.name;

    if (!categories[categoryName]) {
      categories[categoryName] = { name: categoryName, icon: category.icon, total: 0 };
    }
    if (type === "income") categories[categoryName].total! += amount;
    else if (type === "expense") categories[categoryName].total! -= amount;
  });

  return Object.values(categories);
}
