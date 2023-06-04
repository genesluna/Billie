import firestore, { FirebaseFirestoreTypes } from "@react-native-firebase/firestore";

import { User } from "../../models/User";

// Collection reference to the "users" collection in Firestore
export const usersCollection = firestore().collection("users") as FirebaseFirestoreTypes.CollectionReference<User>;

/**
 * Creates a new user document in the Firestore "users" collection.
 *
 * @param user - The user object to be created.
 * @param userId - The unique identifier for the user document.
 *
 * @returns A promise that resolves when the user document is successfully created.
 */
export function createUser(user: User, userId: string) {
  return usersCollection.doc(userId).set({
    ...user,
  });
}

/**
 * Updates an existing user document in the Firestore "users" collection.
 *
 * @param user - The updated user object.
 * @param userId - The unique identifier of the user document to be updated.
 *
 * @returns A promise that resolves when the user document is successfully updated.
 */
export function updateUser(user: User, userId: string) {
  return usersCollection.doc(userId).update({
    ...user,
  });
}
