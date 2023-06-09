import { useContext, useState, useEffect, ReactNode, createContext } from "react";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import auth, { FirebaseAuthTypes } from "@react-native-firebase/auth";
import * as SplashScreen from "expo-splash-screen";

import { updateUser } from "../services/firestore/userService";
import { User } from "../models/User";

// Keep the splash screen visible while we initialize the app
SplashScreen.preventAutoHideAsync();

GoogleSignin.configure({
  webClientId: "891042087368-rv9v9ir4p3ec8rl4n5r460elk31f901u.apps.googleusercontent.com",
  offlineAccess: true,
});

type AuthContextProps = {
  children: ReactNode;
};

type AuthContextType = {
  authUser: FirebaseAuthTypes.User | null;
  register: (email: string, password: string) => Promise<FirebaseAuthTypes.UserCredential>;
  login: (email: string, password: string) => Promise<FirebaseAuthTypes.UserCredential>;
  loginWithGoogle: () => Promise<FirebaseAuthTypes.UserCredential>;
  updateUser: (user: User, userId: string) => Promise<void>;
  deleteCurrentUser: () => Promise<void> | undefined;
  resetPassword: (email: string) => Promise<void>;
  isEmailVerified(): boolean | undefined;
  reloadAuthUser: () => Promise<void>;
  logout: () => Promise<void>;
};

/**
 * The authentication context object that is passed down through the component tree.
 */
const AuthContext = createContext<AuthContextType>({} as AuthContextType);

/**
 * A hook that returns the authentication context.
 *
 * @returns An object containing the current user object and the authentication functions.
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * Provides authentication context for the app using Firebase Authentication.
 *
 * @param children - ReactNode representing the child components to be rendered within the provider.
 * @returns A component that wraps the app with an authentication context.
 */
export function AuthProvider({ children }: AuthContextProps) {
  const [initializingAuthUser, setInitializingAuthUser] = useState<boolean>(true);
  const [authUser, setAuthUser] = useState<FirebaseAuthTypes.User | null>(null);

  /**
   * Registers a new user with Firebase Authentication.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   *
   * @returns A Promise that resolves with the user's credential after successful registration.
   */
  function register(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
    return auth().createUserWithEmailAndPassword(email, password);
  }

  /**
   * Logs in a user with Firebase Authentication.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   *
   * @returns A Promise that resolves with the user's credential after successful login.
   */
  function login(email: string, password: string): Promise<FirebaseAuthTypes.UserCredential> {
    return auth().signInWithEmailAndPassword(email, password);
  }

  /**
   * Logs in a user with Google Authentication.
   *
   * @returns A Promise that resolves with the user's credential after successful login.
   */
  async function loginWithGoogle(): Promise<FirebaseAuthTypes.UserCredential> {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return await auth().signInWithCredential(googleCredential);
  }

  /**
   * Reloads currently authenticated user.
   *
   * @returns A Promise that resolves after successful reload.
   */
  async function reloadAuthUser(): Promise<void> {
    await auth().currentUser?.reload();
    setAuthUser(auth().currentUser);
  }
  /**
   * Checks if the currently authenticated user has verified the email.
   *
   * @returns A boolean or undefined.
   */
  function isEmailVerified(): boolean | undefined {
    return auth().currentUser?.emailVerified;
  }

  /**
   * Logs out the currently authenticated user.
   *
   * @returns A Promise that resolves after successful logout.
   */
  function logout(): Promise<void> {
    //GoogleSignin.signOut();
    return auth().signOut();
  }

  /**
   * Deletes the currently authenticated user.
   *
   * @returns A Promise that resolves after successful deletion or undefined.
   */
  function deleteCurrentUser(): Promise<void> | undefined {
    return auth().currentUser?.delete();
  }

  /**
   * Sends a password reset email to the provided email address.
   *
   * @param email - The email address associated with the user's account.
   *
   * @returns A Promise that resolves after the password reset email has been sent.
   */
  function resetPassword(email: string): Promise<void> {
    return auth().sendPasswordResetEmail(email);
  }

  /**
   * Sets up an observer to listen for changes in the user's authentication state.
   *
   * @returns A function to unsubscribe the observer when the component unmounts.
   */
  useEffect(() => {
    const subscriber = auth().onAuthStateChanged((user) => {
      setAuthUser(user);
      if (initializingAuthUser) setInitializingAuthUser(false);
    });

    return subscriber; // unsubscribe on unmount
  }, []);

  const values: AuthContextType = {
    authUser,
    deleteCurrentUser,
    loginWithGoogle,
    isEmailVerified,
    reloadAuthUser,
    resetPassword,
    updateUser,
    register,
    logout,
    login,
  };

  return <AuthContext.Provider value={values}>{!initializingAuthUser && children}</AuthContext.Provider>;
}
