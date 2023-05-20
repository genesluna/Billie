import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";

import AddTransactionForm from "../../components/forms/User/AddTransactionForm";
import { useTransactions } from "../../context/TransactionsContext";
import Container from "../../components/common/Container";
import { Transaction } from "../../models/Transaction";
import { useAuth } from "../../context/AuthContext";

const AddTransaction = () => {
  const navigation = useNavigation();
  const { authUser } = useAuth();
  const { addTransaction, updateTransaction, addItemToCurrentMonthTransactions, updateItemInCurrentMonthTransactions } =
    useTransactions();

  async function handleAddTransaction(trasaction: Transaction): Promise<void> {
    try {
      const result = await addTransaction(trasaction, authUser?.uid!);
      trasaction.Id = result.id;
      addItemToCurrentMonthTransactions(trasaction);
      navigation.navigate("home");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateTransaction(trasaction: Transaction): Promise<void> {
    try {
      await updateTransaction(trasaction, authUser?.uid!);
      updateItemInCurrentMonthTransactions(trasaction);
      navigation.navigate("home");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <AddTransactionForm onAddTransaction={handleAddTransaction} onUpdateTransaction={handleUpdateTransaction} />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddTransaction;
