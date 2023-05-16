import { ScrollView, View, StatusBar, FlatList } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

import Container from "../../components/common/Container";
import Text from "../../components/common/Text";
import colors from "../../../colors";
import TransactionCard from "../../components/TransactionCard";
import {
  filterTransactionsByCurrentMonthYear,
  months,
  sortTransactionsByDate,
  sumAmountByTransactionType,
} from "../../utils/utils";
import transactionsJson from "../../data/dummyTransactions.json";

let transactions = filterTransactionsByCurrentMonthYear(transactionsJson["transactions"]);
transactions = sortTransactionsByDate(transactions);

type Props = {};

const statusBarHeight = StatusBar.currentHeight ? StatusBar.currentHeight + 22 : 64;

const Home = (props: Props) => {
  const income = sumAmountByTransactionType(transactions, "income");
  const expenses = sumAmountByTransactionType(transactions, "expense");
  const total = income - expenses;

  return (
    <View className="flex-1">
      <View className="h-40 p-4 bg-primary" style={{ paddingTop: statusBarHeight }}>
        <Text size="base" className="font-medium text-content-100">
          Genes Luna
        </Text>
      </View>
      <ScrollView
        className="mt-[-60] flex-none z-50"
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 12 }}
      >
        <View className="bg-content-100 dark:bg-base-400 rounded-lg shadow-md shadow-base-500 dark:shadow-base-350 h-24 p-4 min-w-[144]">
          <View className="flex-row justify-between items-center">
            <Text size="base">Despesas</Text>
            <Icon name="arrow-down-circle" size={20} color={colors.content.expense} />
          </View>
          <Text size="xl" className="font-medium mt-3">
            {expenses.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>

        <View className=" bg-content-100 dark:bg-base-400 rounded-lg shadow-md shadow-base-500 dark:shadow-base-350 h-24 p-4 min-w-[144]">
          <View className="flex-row justify-between items-center">
            <Text size="base">Receitas</Text>
            <Icon name="arrow-up-circle" size={20} color={colors.content.income} />
          </View>
          <Text size="xl" className="font-medium mt-3">
            {income.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>

        <View className="bg-content-100 dark:bg-base-400 rounded-lg shadow-md shadow-base-500 dark:shadow-base-400 h-24 p-4 min-w-[144]">
          <View className="flex-row justify-between items-center">
            <Text size="base">Total</Text>
            <Icon name="dollar-sign" size={20} color={colors.content.income} />
          </View>
          <Text size="xl" className="font-medium mt-3">
            {total.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
        </View>
      </ScrollView>
      <Container>
        <Text size="lg" className="font-medium w-full text-start pb-4 pt-1">
          Movimentações de {months[new Date().getMonth()]}
        </Text>
        <FlatList
          className="w-full"
          data={transactions}
          keyExtractor={(item) => item.Id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TransactionCard
              userId={item.userId}
              type={item.type}
              amount={item.amount}
              date={new Date(item.date)}
              description={item.description}
              category={{ name: item.category.name, icon: item.category.icon }}
            />
          )}
        />
      </Container>
    </View>
  );
};

export default Home;
