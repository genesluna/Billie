import { View, FlatList, ActivityIndicator, Alert, Modal } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

import UserProfile, { UserProfileFormValues } from "../../components/forms/User/UserProfileForm";
import TransactionsMonthSelector from "../../components/TransactionsMonthSelector";
import TransactionsListEmpty from "../../components/TransactionsListEmpty";
import { usersCollection } from "../../services/firestore/userService";
import { useTransactions } from "../../context/TransactionsContext";
import TransactionCard from "../../components/TransactionCard";
import HighlightCards from "../../components/HighlightCards";
import Container from "../../components/common/Container";
import { Transaction } from "../../models/Transaction";
import HomeHeader from "../../components/HomeHeader";
import { useAuth } from "../../context/AuthContext";
import colors from "../../../colors";
import { User } from "../../models/User";

const Home = () => {
  const { transactions, isLoading, deleteItemFromCurrentMonthTransactions, deleteTransaction } = useTransactions();
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);
  const [appUser, setAppUser] = useState<User | undefined>(undefined);
  const navigation = useNavigation();
  const { authUser, updateUser } = useAuth();

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

  async function handleProfileSubmit(values: UserProfileFormValues) {
    console.log(values);
    try {
      await updateUser(
        {
          email: values.email,
          name: values.name,
          phoneNumber: values.phoneNumber,
          photoURL: values.photoURL,
        },
        authUser?.uid!
      );
    } catch (error) {
      console.log(error);
    } finally {
      setShowProfileModal(false);
    }
  }

  /**
   * Sets up an observer to listen for changes in the user's document state.
   *
   * @returns A function to unsubscribe the observer when the component unmounts.
   */
  useEffect(() => {
    const subscriber = usersCollection.doc(authUser?.uid).onSnapshot(
      (documentSnapshot) => {
        if (documentSnapshot.exists) {
          setAppUser(documentSnapshot.data());
        }
      },
      (error) => {
        if (appUser) setAppUser(undefined);
        console.log(error);
      }
    );

    return subscriber; // unsubscribe on unmount
  }, [authUser?.uid]);

  return (
    <View className="flex-1">
      <HomeHeader
        appUser={appUser ?? {}}
        onProfilePress={() => {
          setShowProfileModal(true);
        }}
      />

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
      <Modal animationType="slide" visible={showProfileModal}>
        <UserProfile
          appUser={appUser ?? {}}
          onSubmit={handleProfileSubmit}
          onClose={() => {
            setShowProfileModal(false);
          }}
        />
      </Modal>
    </View>
  );
};

export default Home;
