import { View, FlatList, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";

import TransactionsListHeader from "../../components/TransactionsListHeader";
import TransactionCard from "../../components/TransactionCard";
import HighlightCards from "../../components/HighlightCards";
import Container from "../../components/common/Container";
import { Transaction } from "../../models/Transaction";
import HomeHeader from "../../components/HomeHeader";
import { useAuth } from "../../context/AuthContext";
import {
  getCurrentMonthUserTransactions,
  getOldestUserTransactionDate,
  getUserTransactionsByMonthAndYear,
} from "../../services/firestore/transactionsService";
import colors from "../../../colors";
import TransactionsListEmpty from "../../components/TransactionsListEmpty";

const Home = () => {
  const [isLoading, setIsloading] = useState<boolean>(true);
  const [transactions, setTransactions] = useState<Transaction[]>([] as Transaction[]);
  const [oldestTransactionDate, setOldestTransactionDate] = useState<Date | undefined>(undefined);
  const { authUser } = useAuth();

  useEffect(() => {
    const getTrasactions = async () => {
      try {
        const transactionsResult = await getCurrentMonthUserTransactions(authUser?.uid!);
        const oldestTransactionDateResult = await getOldestUserTransactionDate(authUser?.uid!);
        setOldestTransactionDate(oldestTransactionDateResult);
        setTransactions(transactionsResult);
      } catch (error) {
        console.log(error);
      } finally {
        setIsloading(false);
      }
    };

    getTrasactions();
  }, []);

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

  async function handlePreviousAndNextMonthTransactions(month: number, year: number): Promise<void> {
    try {
      setIsloading(true);
      const result = await getUserTransactionsByMonthAndYear(authUser?.uid!, month, year);
      setTransactions(result);
    } catch (error) {
      console.log(error);
    } finally {
      setIsloading(false);
    }
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
