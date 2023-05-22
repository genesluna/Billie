import { View, ViewProps } from "react-native";

import { useTransactions } from "../context/TransactionsContext";
import { months } from "../utils/transactionsUtils";
import Button from "./common/Button";
import Text from "./common/Text";

type TransactionsMonthSelectorProps = ViewProps & {};

const TransactionsMonthSelector = ({ ...props }: TransactionsMonthSelectorProps) => {
  const { transactions, oldestTransactionDate, handlePreviousAndNextMonthTransactions } = useTransactions();
  const currentDate = transactions[0]?.date ?? new Date();
  const initialDate = oldestTransactionDate;

  async function onPreviousMonth(): Promise<void> {
    const currentMonth = transactions[0]?.date?.getMonth() ?? new Date().getMonth();
    const currentYear = transactions[0]?.date?.getFullYear() ?? new Date().getFullYear();
    const month = currentMonth > 0 ? currentMonth - 1 : 11;
    const year = currentMonth !== 0 ? currentYear : currentYear - 1;
    return await handlePreviousAndNextMonthTransactions(month, year);
  }

  async function onNextMonth(): Promise<void> {
    const currentMonth = transactions[0]?.date?.getMonth() ?? new Date().getMonth();
    const currentYear = transactions[0]?.date?.getFullYear() ?? new Date().getFullYear();
    const month = currentMonth < 11 ? currentMonth + 1 : 0;
    const year = currentMonth !== 11 ? currentYear : currentYear + 1;
    return await handlePreviousAndNextMonthTransactions(month, year);
  }

  if (!initialDate) return null;

  return (
    <View className="flex-row items-center justify-between w-full px-2 pt-3 pb-5" {...props}>
      {initialDate.getMonth() !== currentDate.getMonth() ? (
        <Button
          icon="arrow-left"
          iconOnly
          className="w-10 h-10 rounded-full bg-primary/50 dark:bg-primary/30"
          onPress={onPreviousMonth}
        />
      ) : (
        <View className="w-10 h-10" />
      )}
      <Text size="lg" className="font-medium text-center">
        {months[currentDate.getMonth()]} de {currentDate.getFullYear()}
      </Text>
      {currentDate.getMonth() !== new Date().getMonth() ? (
        <Button
          icon="arrow-right"
          iconOnly
          className="w-10 h-10 rounded-full bg-primary/50 dark:bg-primary/30"
          onPress={onNextMonth}
        />
      ) : (
        <View className="w-10 h-10" />
      )}
    </View>
  );
};

export default TransactionsMonthSelector;
