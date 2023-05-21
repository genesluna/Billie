import { View, FlatList, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import TransactionsListHeader from "../../components/TransactionsListHeader";
import TransactionsListEmpty from "../../components/TransactionsListEmpty";
import { useTransactions } from "../../context/TransactionsContext";
import TransactionCard from "../../components/TransactionCard";
import HighlightCards from "../../components/HighlightCards";
import Container from "../../components/common/Container";
import { Transaction } from "../../models/Transaction";
import HomeHeader from "../../components/HomeHeader";
import { useAuth } from "../../context/AuthContext";
import colors from "../../../colors";

const Home = () => {
  const {
    oldestTransactionDate,
    transactions,
    isLoading,
    handlePreviousAndNextMonthTransactions,
    deleteItemFromCurrentMonthTransactions,
    deleteTransaction,
  } = useTransactions();
  const navigation = useNavigation();
  const { authUser } = useAuth();

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

  function handleEdit(item: Transaction) {
    navigation.navigate("addTransaction", { transactionId: item.Id! });
  }

  function handleDelete(itemId: string) {
    return Alert.alert("Deletar", "Tem certeza que deseja deletar a transação?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: async () => {
          try {
            await deleteTransaction(itemId, authUser?.uid!);
            deleteItemFromCurrentMonthTransactions(itemId);
          } catch (error) {
            console.log(error);
          }
        },
      },
    ]);
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
            renderItem={({ item, index }) => (
              <TransactionCard
                index={index}
                transaction={item}
                onDelete={() => handleDelete(item.Id!)}
                onEdit={() => handleEdit(item)}
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
