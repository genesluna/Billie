import { Keyboard, KeyboardAvoidingView, Platform, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import storage from "@react-native-firebase/storage";
import * as Crypto from "expo-crypto";

import AddTransactionForm from "../../components/forms/User/AddTransactionForm";
import { useTransactions } from "../../context/TransactionsContext";
import { getTransactionById } from "../../utils/transactionsUtils";
import Container from "../../components/common/Container";
import { Transaction } from "../../models/Transaction";
import { useAuth } from "../../context/AuthContext";

const AddTransaction = () => {
  const navigation = useNavigation();
  const { authUser } = useAuth();
  const {
    transactions,
    addTransaction,
    updateTransaction,
    addItemToCurrentMonthTransactions,
    updateItemInCurrentMonthTransactions,
  } = useTransactions();

  async function handleAddTransaction(transaction: Transaction): Promise<void> {
    try {
      if (transaction.photoURL) {
        const path = `${authUser?.uid}/${transaction.date.getFullYear()}/${
          transaction.date.getMonth() + 1
        }/${Crypto.randomUUID()}.jpeg`;
        transaction.photoURL = await handleImageUpload(transaction.photoURL, path);
      }

      const result = await addTransaction(transaction, authUser?.uid!);
      transaction.Id = result.id;
      addItemToCurrentMonthTransactions(transaction);
      navigation.navigate("home");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleUpdateTransaction(transaction: Transaction): Promise<void> {
    try {
      const oldTransaction = getTransactionById(transactions, transaction.Id!);

      if (transaction.photoURL && transaction.photoURL !== oldTransaction?.photoURL) {
        const path = `${authUser?.uid}/${transaction.date.getFullYear()}/${
          transaction.date.getMonth() + 1
        }/${Crypto.randomUUID()}.jpeg`;
        transaction.photoURL = await handleImageUpload(transaction.photoURL, path);
      }

      await updateTransaction(transaction, authUser?.uid!);
      updateItemInCurrentMonthTransactions(transaction);
      navigation.navigate("home");
    } catch (error) {
      console.log(error);
    }
  }

  async function handleImageUpload(uri: string, path: string): Promise<string | undefined> {
    try {
      const reference = storage().ref(path);
      await reference.putFile(uri);
      return await reference.getDownloadURL();
    } catch (error: any) {
      console.log(error);
      throw new Error(error);
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
