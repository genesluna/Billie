import { View, ViewProps, useColorScheme } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

import { useTransactions } from "../context/TransactionsContext";
import colors from "../../colors";
import Text from "./common/Text";

type TransactionsListEmptyProps = ViewProps & {};

/**
 * Component that renders the empty state for the transactions list.
 * It displays a message and an icon when there are no transactions.
 */
const TransactionsListEmpty = ({ ...props }: TransactionsListEmptyProps) => {
  let colorScheme = useColorScheme();
  const { oldestTransactionDate } = useTransactions();

  return (
    <View className="items-center justify-center flex-1 px-5 pb-20" {...props}>
      <Icon name="inbox" size={76} color={colorScheme === "dark" ? colors.content[150] : colors.content[400]} />
      {!oldestTransactionDate ? (
        <Text size="xl" className="mt-4 font-medium text-center">
          Ainda não há transações
        </Text>
      ) : (
        <Text size="xl" className="mt-4 font-medium text-center">
          Ainda não há transações esse mês
        </Text>
      )}
      <Text size="base" className="mt-4 text-center">
        Clique no botão{" "}
        <Text size="base" className="font-bold text-primary-focus dark:text-primary">
          Adicionar
        </Text>{" "}
        para cadastrar uma despesa ou uma receita
      </Text>
    </View>
  );
};

export default TransactionsListEmpty;
