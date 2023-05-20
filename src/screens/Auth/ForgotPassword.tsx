import { Keyboard, KeyboardAvoidingView, Platform, ToastAndroid, TouchableWithoutFeedback } from "react-native";

import ForgotPasswordForm, { ForgotPaswordFormValues } from "../../components/forms/Auth/ForgotPasswordForm";
import Container from "../../components/common/Container";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../context/AuthContext";

const ForgotPassword = () => {
  const navigation = useNavigation();
  const { resetPassword } = useAuth();

  async function handleResetPassword({ email }: ForgotPaswordFormValues): Promise<void> {
    try {
      await resetPassword(email);
      ToastAndroid.show("E-mail enviado com sucesso.", ToastAndroid.LONG);
      navigation.goBack();
    } catch (error) {
      ToastAndroid.show("Email inválido", ToastAndroid.LONG);
      console.log(error);
    }
  }

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container className="px-6">
          <ForgotPasswordForm onSubmit={handleResetPassword} />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ForgotPassword;
