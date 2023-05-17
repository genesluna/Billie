import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { View, useColorScheme } from "react-native";
import { ComponentProps } from "react";

import colors from "../../colors";
import Text from "./common/Text";
import { Transaction } from "../models/Transaction";
import { formatDate } from "../utils/utils";

const TransactionCard = (props: Transaction) => {
  let colorScheme = useColorScheme();
  const amountColor = props.type === "income" ? "text-content-income" : "text-content-expense";

  return (
    <View className="flex-row items-center w-full p-3 mb-2 rounded-lg bg-content-100 dark:bg-base-400">
      <View className="w-12 h-12 p-3 rounded-full bg-primary-faded dark:bg-primary-focus/50">
        <Icon
          name={props.category.icon as ComponentProps<typeof Icon>["name"]}
          color={colorScheme === "dark" ? colors.content[150] : colors.content[400]}
          size={24}
        />
      </View>
      <View className="flex-1 pl-3 pr-6">
        <Text size="base" numberOfLines={1}>
          {props.description}
        </Text>
        <Text size="sm" className="italic text-content-300 dark:text-content-200">
          {props.category.name}
        </Text>
      </View>
      <View className="items-center">
        <Text size="base" className={`font-medium ${amountColor}`}>
          {props.amount.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </Text>
        <Text size="sm" className="text-content-300 dark:text-content-200">
          {formatDate(props.date)}
        </Text>
      </View>
    </View>
  );
};

export default TransactionCard;
