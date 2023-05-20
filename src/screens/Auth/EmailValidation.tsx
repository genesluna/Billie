import { Feather as Icon } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import { View, ToastAndroid } from "react-native";

import Container from "../../components/common/Container";
import { useNavigation } from "@react-navigation/native";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import Text from "../../components/common/Text";
import colors from "../../../colors";

const EmailValidation = () => {
  const [isLoadingResend, setIsLoadingResend] = useState<boolean>(false);
  const [isLoadingVerify, setIsLoadingVerify] = useState<boolean>(false);
  const [time, setTime] = useState<number>(60);
  const { authUser, reloadAuthUser, isEmailVerified } = useAuth();
  const timerRef = useRef<number>(time);
  const navigation = useNavigation();

  useEffect(() => {
    const timerId = setInterval(() => {
      timerRef.current -= 1;
      if (timerRef.current < 0) {
        clearInterval(timerId);
      } else {
        setTime(timerRef.current);
      }
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, []);

  async function handleResendEmail() {
    try {
      setIsLoadingResend(true);
      await authUser?.sendEmailVerification();
      ToastAndroid.show("E-mail reenviado.", ToastAndroid.LONG);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingResend(false);
    }
  }

  async function handeVerifyEmail() {
    try {
      setIsLoadingVerify(true);
      await reloadAuthUser();
    } catch (error) {
      console.log(error);
    } finally {
      if (isEmailVerified()) {
        ToastAndroid.show("O e-mail foi validado com sucesso.", ToastAndroid.LONG);
        await reloadAuthUser();
      } else {
        ToastAndroid.show(
          "O e-mail ainda não pode ser validado. Tente novamente em alguns segundos",
          ToastAndroid.LONG
        );
      }
      setIsLoadingVerify(false);
    }
  }

  return (
    <Container className="px-6">
      <View className="justify-center p-8 my-10 rounded-full bg-base-400 dark:bg-base-600">
        <Icon name="mail" size={50} color={colors.content[100]} />
      </View>

      <View className="flex-1 w-full">
        <Text size="sm" className="text-justify">
          Faça a verificação clicando no link que foi enviado para:{" "}
          <Text size="sm" className="font-bold">
            {authUser?.email}
          </Text>
        </Text>
        <Text size="sm" className="my-6 text-justify">
          Depois clique no botão abaixo:
        </Text>
        <Button
          type="primary"
          icon="check-circle"
          label="e-mail verificado"
          onPress={handeVerifyEmail}
          isLoading={isLoadingVerify}
          disabled={isLoadingVerify}
        />
        <Text size="sm" className="my-6 text-justify">
          Não recebeu o e-mail? Já olhou na caixa de Span? Você poderá solicitar o reenvio clicando no botão abaixo:
        </Text>
        <Button
          type="secondary"
          icon="mail"
          className={time > 0 ? "bg-base-350 dark:bg-base-350" : ""}
          label={time > 0 ? `aguarde ${time} segundos` : "renviar e-mail"}
          disabled={time > 0 || isLoadingResend}
          onPress={handleResendEmail}
          isLoading={isLoadingResend}
        />
      </View>
    </Container>
  );
};

export default EmailValidation;
