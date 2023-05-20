import { Keyboard, KeyboardAvoidingView, Platform, ToastAndroid, TouchableWithoutFeedback } from "react-native";

import RegisterForm, { RegisterFormValues } from "../../components/forms/Auth/RegisterForm";
import { createUser } from "../../services/firestore/userService";
import Container from "../../components/common/Container";
import { useNavigation } from "@react-navigation/native";
import Header from "../../components/forms/Auth/Header";
import { useAuth } from "../../context/AuthContext";

const Register = () => {
  const { register, reloadAuthUser } = useAuth();
  const navigation = useNavigation();

  async function handleRegister({ name, email, password }: RegisterFormValues) {
    try {
      let result = await register(email.trim(), password.trim());
      await result.user.updateProfile({ displayName: name.trim() });
      await result.user.sendEmailVerification();
      await reloadAuthUser();
      await createUser(
        {
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL ?? "",
        },
        result.user.uid
      );
      ToastAndroid.show("Usuário cadastrado com sucesso.", ToastAndroid.LONG);
      navigation.reset({ index: 0, routes: [{ name: "emailValidation" }] });
    } catch (error: any) {
      if (error.code === "auth/email-already-in-use") {
        ToastAndroid.showWithGravity("Este email já está cadastrado", ToastAndroid.LONG, ToastAndroid.TOP);
      }

      if (error.code === "auth/invalid-email") {
        ToastAndroid.showWithGravity("Email inválido", ToastAndroid.SHORT, ToastAndroid.TOP);
      }

      console.log(error);
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container className="px-6">
          <Header className="mt-4 mb-16" />
          <RegisterForm onSubmit={handleRegister} />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Register;
