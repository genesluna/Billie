import { Keyboard, KeyboardAvoidingView, Platform, ToastAndroid, TouchableWithoutFeedback } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

import LoginForm, { LoginFormValues } from "../../components/forms/Auth/LoginForm";
import { createUser } from "../../services/firestore/userService";
import Container from "../../components/common/Container";
import Header from "../../components/forms/Auth/Header";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [isGoogleSinginLoading, setIsGoolgeSigninLoaging] = useState<boolean>(false);
  const navigation = useNavigation();
  const { login, logout, deleteCurrentUser, loginWithGoogle, authUser } = useAuth();

  useEffect(() => {
    // Handles unfinished registration when the user is still logged in and restarts the app
    if (authUser) {
      if (!authUser.emailVerified) {
        navigation.reset({ index: 0, routes: [{ name: "emailValidation" }] });
      }
    }
  }, []);

  function openRegisterScreen() {
    navigation.navigate("register");
  }

  function openForgotPasswordScreen() {
    navigation.navigate("forgotPassword");
  }

  async function handleLogin({ email, password }: LoginFormValues) {
    try {
      await login(email.trim(), password.trim());
      // TODO: handle unfinished registration during new login
    } catch (error) {
      ToastAndroid.showWithGravity("Email ou senha incorretos", ToastAndroid.LONG, ToastAndroid.TOP);
      console.log(error);
    }
  }

  async function handleGoogleSignin() {
    try {
      setIsGoolgeSigninLoaging(true);
      const result = await loginWithGoogle();
      try {
        if (result.additionalUserInfo?.isNewUser) {
          await createUser(
            {
              name: result.user.displayName,
              email: result.user.email,
              photoURL: result.user.photoURL ?? "",
            },
            result.user.uid
          );
          ToastAndroid.show("Usuário cadastrado com sucesso.", ToastAndroid.LONG);
        }
      } catch (error) {
        await deleteCurrentUser();
        await logout();
        console.log(error);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsGoolgeSigninLoaging(false);
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container className="px-6">
          <Header className="mt-4 mb-16" />
          <LoginForm
            onSubmit={handleLogin}
            onRegister={openRegisterScreen}
            onForgotPassword={openForgotPasswordScreen}
            onGoogleSingin={handleGoogleSignin}
            isGoogleSinginLoading={isGoogleSinginLoading}
          />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;
