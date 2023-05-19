import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Container from "../../components/common/Container";
import { Transaction } from "../../models/Transaction";
import { useTransactions } from "../../context/TransactionsContext";
import AddTransactionForm from "../../components/forms/User/AddTransactionForm";

const AddTransaction = () => {
  const navigation = useNavigation();
  const { addTransaction } = useTransactions();

  async function handleAddTransaction(trasaction: Transaction): Promise<void> {
    try {
      const result = await addTransaction(trasaction);
      trasaction.Id = result.id;
      navigation.navigate("home");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container>
          <AddTransactionForm onSubmit={handleAddTransaction} />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AddTransaction;
