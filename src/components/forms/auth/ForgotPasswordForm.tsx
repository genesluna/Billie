import { View, ViewProps } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { useFormik } from "formik";
import * as Yup from "yup";

import Button from "../../common/Button";
import colors from "../../../../colors";
import Input from "../../common/Input";
import Text from "../../common/Text";

type ForgotPaswordFormProps = ViewProps & {
  onSubmit: (values: ForgotPaswordFormValues) => Promise<void>;
};

export type ForgotPaswordFormValues = {
  email: string;
};

const ForgotPasswordForm = ({ onSubmit, ...props }: ForgotPaswordFormProps) => {
  const initialValues: ForgotPaswordFormValues = { email: "" };

  const forgotPasswordSchema = Yup.object().shape({
    email: Yup.string().email("Email inválido").required("Informe o email"),
  });

  const { handleChange, handleSubmit, handleBlur, values, errors, touched, isSubmitting } = useFormik({
    validationSchema: forgotPasswordSchema,
    initialValues: initialValues,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  return (
    <View className="items-center justify-end flex-1 w-full" {...props}>
      <View className="justify-center p-8 my-12 rounded-full bg-base-350 dark:bg-base-450">
        <Icon name="key" size={50} color={colors.content[100]} />
      </View>

      <Text size="sm" className="w-full mb-8 text-justify">
        Você receberá um e-mail com um link para resetar sua senha. Basta clicar no link e definir uma nova senha.
      </Text>

      <Input
        icon="mail"
        placeholder="Digite seu e-mail"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        keyboardAppearance="dark"
        returnKeyType="done"
        onChangeText={handleChange("email")}
        onBlur={handleBlur("email")}
        error={errors.email}
        touched={touched.email}
        value={values.email}
        onSubmitEditing={() => handleSubmit()}
      />

      <Button
        icon="unlock"
        type="danger"
        className="w-full mt-6"
        label="resetar a senha"
        onPress={() => handleSubmit()}
        disabled={isSubmitting}
        isLoading={isSubmitting}
      />

      {/* KeyboardAvoidingView fix */}
      <View className="flex-1" />
    </View>
  );
};

export default ForgotPasswordForm;
