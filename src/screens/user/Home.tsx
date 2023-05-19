import { View, FlatList, ActivityIndicator } from "react-native";

import TransactionsListHeader from "../../components/TransactionsListHeader";
import TransactionsListEmpty from "../../components/TransactionsListEmpty";
import { useTransactions } from "../../context/TransactionsContext";
import TransactionCard from "../../components/TransactionCard";
import HighlightCards from "../../components/HighlightCards";
import Container from "../../components/common/Container";
import HomeHeader from "../../components/HomeHeader";
import colors from "../../../colors";

const Home = () => {
  const { isLoading, transactions, oldestTransactionDate, handlePreviousAndNextMonthTransactions } = useTransactions();

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

  return (
    <View className="flex-1">
      <HomeHeader />

      <HighlightCards transactions={transactions} isLoading={isLoading} />

      <Container>
        {!isLoading ? (
          <FlatList
            className="w-full"
            contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
            data={transactions}
            keyExtractor={(item) => item?.Id!}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => <TransactionsListEmpty initialDate={oldestTransactionDate} />}
            ListHeaderComponent={() => (
              <TransactionsListHeader
                currentDate={transactions[0]?.date ?? new Date()}
                initialDate={oldestTransactionDate}
                onPreviousMonth={onPreviousMonth}
                onNextMonth={onNextMonth}
              />
            )}
            renderItem={({ item }) => (
              <TransactionCard
                userId={item?.userId}
                type={item?.type}
                amount={item?.amount}
                date={new Date(item?.date)}
                description={item?.description}
                category={{ name: item?.category.name, icon: item?.category.icon }}
              />
            )}
          />
        ) : (
          <ActivityIndicator size={60} color={colors.primary.DEFAULT} />
        )}
      </Container>
    </View>
  );
};

export default Home;
