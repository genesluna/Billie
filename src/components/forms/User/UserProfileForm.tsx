import {
  GestureResponderEvent,
  View,
  ViewProps,
  Image,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  TextInput,
} from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useFormik } from "formik";
import * as Yup from "yup";

import Button from "../../common/Button";
import colors from "../../../../colors";
import Input from "../../common/Input";
import Text from "../../common/Text";
import Container from "../../common/Container";
import { useAuth } from "../../../context/AuthContext";
import MaskedInput from "../../common/MaskedInput";
import { maskPhone } from "../../../utils/textInputMasks";
import { useRef } from "react";
import { User } from "../../../models/User";

type UserProfileFormProps = ViewProps & {
  appUser: User;
  onSubmit: (values: UserProfileFormValues) => Promise<void>;
  onClose: (event: GestureResponderEvent) => void;
};

export type UserProfileFormValues = {
  email: string;
  name: string;
  phoneNumber: string;
  photoURL: string;
};

const UserProfileForm = ({ onSubmit, onClose, appUser, ...props }: UserProfileFormProps) => {
  const { authUser } = useAuth();
  const initialValues: UserProfileFormValues = {
    email: appUser.email!,
    name: appUser.name! ?? "",
    phoneNumber: maskPhone(appUser.phoneNumber ?? ""),
    photoURL: appUser.photoURL ?? "",
  };

  const forgotPasswordSchema = Yup.object().shape({
    name: Yup.string().required("O nome é obrigatório"),
  });

  const { handleChange, handleSubmit, handleBlur, values, errors, touched, isSubmitting } = useFormik({
    validationSchema: forgotPasswordSchema,
    initialValues: initialValues,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  const phone = useRef<TextInput>(null);

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <Container className="px-6 pt-4" {...props}>
          <Text size="h2" className="w-full mt-8 text-center">
            Perfil do Usuário
          </Text>

          {!authUser?.photoURL ? (
            <View className="justify-center p-8 my-12 rounded-full bg-base-350 dark:bg-base-450">
              <Icon name="user" size={50} color={colors.content[100]} />
            </View>
          ) : (
            <Image
              source={{ uri: authUser.photoURL }}
              resizeMode="contain"
              className="my-12 rounded-full resize w-28 h-28"
            />
          )}

          <Input icon="mail" readOnly placeholder="Digite seu e-mail" value={values.email} />
          <Input
            icon="user"
            placeholder="Digite seu nome"
            autoCapitalize="words"
            autoComplete="name"
            keyboardType="default"
            keyboardAppearance="dark"
            returnKeyType="next"
            onChangeText={handleChange("name")}
            onBlur={handleBlur("name")}
            error={errors.name}
            touched={touched.name}
            value={values.name}
            onSubmitEditing={() => phone.current?.focus()}
          />
          <MaskedInput
            ref={phone}
            icon="phone"
            mask="PHONE"
            placeholder="Digite seu telefone"
            autoCapitalize="none"
            autoComplete="off"
            keyboardType="phone-pad"
            keyboardAppearance="dark"
            returnKeyType="done"
            onChangeText={handleChange("phoneNumber")}
            onBlur={handleBlur("phoneNumber")}
            error={errors.phoneNumber}
            touched={touched.phoneNumber}
            value={values.phoneNumber}
            onSubmitEditing={() => handleSubmit()}
          />

          <Button
            icon="save"
            type="primary"
            className="w-full mt-6"
            label="Salvar"
            onPress={() => handleSubmit()}
            disabled={isSubmitting}
            isLoading={isSubmitting}
          />
          <Button icon="arrow-left" type="secondary" className="w-full mt-4" label="Voltar" onPress={onClose} />

          {/* KeyboardAvoidingView fix */}
          <View className="flex-1" />
        </Container>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default UserProfileForm;
