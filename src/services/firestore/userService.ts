import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

import { User } from "../../models/User";

export const usersCollection = firestore().collection("users") as FirebaseFirestoreTypes.CollectionReference<User>;

export function createUser(user: User, userId: string) {
  return usersCollection.doc(userId).set({
    ...user,
  });
}
export function updateUser(user: User, userId: string) {
  return usersCollection.doc(userId).update({
    ...user,
  });
}
