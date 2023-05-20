import { View, useColorScheme, Pressable, PressableProps } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { ComponentProps } from "react";

import { formatDate } from "../utils/transactionsUtils";
import { Transaction } from "../models/Transaction";
import colors from "../../colors";
import Text from "./common/Text";

type TransactionProps = PressableProps & {
  transaction: Transaction;
};

const TransactionCard = ({ transaction, ...props }: TransactionProps) => {
  let colorScheme = useColorScheme();
  const amountColor = transaction.type === "income" ? "text-content-income" : "text-content-expense";

  return (
    <Pressable className="flex-row items-center w-full p-3 mb-2 rounded-lg bg-content-100 dark:bg-base-400" {...props}>
      <View className="w-12 h-12 p-3 rounded-full bg-primary-faded dark:bg-primary-focus/50">
        <Icon
          name={transaction.category.icon as ComponentProps<typeof Icon>["name"]}
          color={colorScheme === "dark" ? colors.content[150] : colors.content[400]}
          size={24}
        />
      </View>
      <View className="flex-1 pl-3 pr-6">
        <Text size="base" numberOfLines={1}>
          {transaction.description}
        </Text>
        <Text size="sm" className="italic text-content-300 dark:text-content-200">
          {transaction.category.name}
        </Text>
      </View>
      <View className="items-center">
        <Text size="base" className={`font-medium ${amountColor}`}>
          {transaction.amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
        <Text size="sm" className="text-content-300 dark:text-content-200">
          {formatDate(transaction.date)}
        </Text>
      </View>
    </Pressable>
  );
};

export default TransactionCard;
