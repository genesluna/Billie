import { View, ViewProps, useColorScheme } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

import colors from "../../colors";
import Text from "./common/Text";

type TransactionsListEmptyProps = ViewProps & {
  initialDate: Date | undefined;
};

const TransactionsListEmpty = ({ initialDate, ...props }: TransactionsListEmptyProps) => {
  let colorScheme = useColorScheme();

  return (
    <View className="items-center px-5 pb-20 flex-1 justify-center">
      <Icon name="inbox" size={76} color={colorScheme === "dark" ? colors.content[150] : colors.content[400]} />
      {!initialDate ? (
        <Text size="xl" className="mt-4 text-center font-medium">
          Ainda não há transações
        </Text>
      ) : (
        <Text size="xl" className="mt-4 text-center font-medium">
          Ainda não há transações esse mês
        </Text>
      )}
      <Text size="base" className="text-center mt-4">
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
