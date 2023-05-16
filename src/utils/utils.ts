/**
 * Array of month names in Portuguese.
 */
export const months: string[] = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

/**
 * Formats a given date into the "DD/MM/YYYY" format.
 * @param data The date to be formatted.
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
 * @param transactions The array of transactions to be sorted.
 * @returns The sorted array of transactions.
 */
export function sortTransactionsByDate(transactions: any[]): any[] {
  const sortedTransactions = transactions.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return sortedTransactions;
}

/**
 * Filters an array of transactions to include only those from the current month and year.
 * @param transactions The array of transactions to be filtered.
 * @returns The filtered array of transactions.
 */
export function filterTransactionsByCurrentMonthYear(transactions: any[]): any[] {
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
 * @param transactions The array of transactions.
 * @param transactionType The transaction type to filter by.
 * @returns The total amount of transactions for the given transaction type.
 */
export function sumAmountByTransactionType(transactions: any[], transactionType: string): number {
  const filteredTransactions = transactions.filter((transaction) => transaction.type === transactionType);
  const totalAmount = filteredTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

  return totalAmount;
}
