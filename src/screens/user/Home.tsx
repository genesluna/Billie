import { View, FlatList, ActivityIndicator, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";

import TransactionsMonthSelector from "../../components/TransactionsMonthSelector";
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
  const { transactions, isLoading, deleteItemFromCurrentMonthTransactions, deleteTransaction } = useTransactions();
  const navigation = useNavigation();
  const { authUser } = useAuth();

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

      <Container className="px-2">
        {!isLoading ? (
          <FlatList
            className="w-full"
            contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start" }}
            data={transactions}
            keyExtractor={(item) => item?.Id!}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => <TransactionsListEmpty />}
            ListHeaderComponent={() => <TransactionsMonthSelector />}
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
