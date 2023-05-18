import { View, ScrollView, ScrollViewProps, ActivityIndicator } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

import colors from "../../colors";
import Text from "./common/Text";
import { sumAmountByTransactionType } from "../utils/utils";
import { Transaction } from "../models/Transaction";

type HighlightCardsProps = ScrollViewProps & {
  transactions: Transaction[];
  isLoading: boolean;
};

const HighlightCards = ({ transactions, isLoading, ...props }: HighlightCardsProps) => {
  const income = sumAmountByTransactionType(transactions, "income");
  const expenses = sumAmountByTransactionType(transactions, "expense");
  const total = income - expenses;

  return (
    <ScrollView
      className="mt-[-60] flex-none z-50"
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}
      {...props}
    >
      <View className="bg-content-100 dark:bg-base-400 rounded-lg shadow-md shadow-base-500 dark:shadow-base-350 h-24 p-4 min-w-[144]">
        <View className="flex-row items-center justify-between">
          <Text size="base">Despesas</Text>
          <Icon name="arrow-down-circle" size={20} color={colors.content.expense} />
        </View>
        {!isLoading ? (
          <Text size="xl" className="mt-3 font-medium">
            {expenses.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        ) : (
          <ActivityIndicator className="mt-4" size={24} color={colors.primary.DEFAULT} />
        )}
      </View>

      <View className=" bg-content-100 dark:bg-base-400 rounded-lg shadow-md shadow-base-500 dark:shadow-base-350 h-24 p-4 min-w-[144]">
        <View className="flex-row items-center justify-between">
          <Text size="base">Receitas</Text>
          <Icon name="arrow-up-circle" size={20} color={colors.content.income} />
        </View>
        {!isLoading ? (
          <Text size="xl" className="mt-3 font-medium">
            {income.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        ) : (
          <ActivityIndicator className="mt-4" size={24} color={colors.primary.DEFAULT} />
        )}
      </View>

      <View className="bg-content-100 dark:bg-base-400 rounded-lg shadow-md shadow-base-500 dark:shadow-base-400 h-24 p-4 min-w-[144]">
        <View className="flex-row items-center justify-between">
          <Text size="base">Total</Text>
          <Icon name="dollar-sign" size={20} color={colors.content.income} />
        </View>
        {!isLoading ? (
          <Text size="xl" className="mt-3 font-medium">
            {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        ) : (
          <ActivityIndicator className="mt-4" size={24} color={colors.primary.DEFAULT} />
        )}
      </View>
    </ScrollView>
  );
};

export default HighlightCards;
