import React, { useRef } from "react";
import { TextInput, View, ViewProps } from "react-native";
import { useFormik } from "formik";
import * as Yup from "yup";

import Input from "../../common/Input";
import Button from "../../common/Button";

type RegisterFormProps = ViewProps & {
  onSubmit: (values: RegisterFormValues) => Promise<void>;
};

export type RegisterFormValues = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

/**
 * A form for registering a new user.
 *
 * @param onSubmit - A callback function to be called when the form is submitted.
 *
 * @returns - A component that contains the register form.
 */
const RegisterForm = ({ onSubmit, ...props }: RegisterFormProps): JSX.Element => {
  const email = useRef<TextInput>(null);
  const password = useRef<TextInput>(null);
  const confirmPassword = useRef<TextInput>(null);

  const initialValues: RegisterFormValues = { name: "", email: "", password: "", confirmPassword: "" };

  const registerSchema = Yup.object().shape({
    name: Yup.string().required("Informe seu nome"),
    email: Yup.string().email("Email inválido").required("Informe o email"),
    password: Yup.string()
      .required("Informe a senha")
      .min(8, "Deve ter no mínimo 8 caracteres")
      .matches(/[a-z]+/, "Deve ter uma letra minúscula")
      .matches(/[A-Z]+/, "Deve ter uma letra maiúscula")
      .matches(/[@$!%*#?&]+/, "Deve ter um caractere especial")
      .matches(/\d+/, "Deve ter um número"),
    confirmPassword: Yup.string()
      .required("Confirme a senha")
      .oneOf([Yup.ref("password")], "As senhas são diferentes"),
  });

  const { handleChange, handleSubmit, handleBlur, values, errors, touched, isSubmitting } = useFormik({
    validationSchema: registerSchema,
    initialValues: initialValues,
    onSubmit: async (values) => {
      await onSubmit(values);
    },
  });

  return (
    <View className="w-full mt-6 mb-4" {...props}>
      <Input
        icon="user"
        placeholder="Digite o seu nome"
        autoCapitalize="words"
        autoComplete="name"
        keyboardAppearance="dark"
        returnKeyType="next"
        onChangeText={handleChange("name")}
        onBlur={handleBlur("name")}
        error={errors.name}
        touched={touched.name}
        value={values.name}
        onSubmitEditing={() => email.current?.focus()}
      />

      <Input
        ref={email}
        icon="mail"
        placeholder="Digite o seu e-mail"
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        keyboardAppearance="dark"
        returnKeyType="next"
        onChangeText={handleChange("email")}
        onBlur={handleBlur("email")}
        error={errors.email}
        touched={touched.email}
        value={values.email}
        onSubmitEditing={() => password.current?.focus()}
      />
      <Input
        ref={password}
        icon="lock"
        placeholder="Digite a sua senha"
        isPassword={true}
        autoComplete="password"
        autoCapitalize="none"
        keyboardAppearance="dark"
        returnKeyType="next"
        onChangeText={handleChange("password")}
        onBlur={handleBlur("password")}
        error={errors.password}
        touched={touched.password}
        value={values.password}
        onSubmitEditing={() => confirmPassword.current?.focus()}
      />

      <Input
        ref={confirmPassword}
        icon="lock"
        placeholder="Confirme a sua senha"
        isPassword={true}
        autoComplete="password"
        autoCapitalize="none"
        keyboardAppearance="dark"
        returnKeyType="done"
        onChangeText={handleChange("confirmPassword")}
        onBlur={handleBlur("confirmPassword")}
        error={errors.confirmPassword}
        touched={touched.confirmPassword}
        value={values.confirmPassword}
        onSubmitEditing={() => handleSubmit()}
      />

      <Button
        icon="file-text"
        className="mt-6 mb-10"
        label="registrar"
        onPress={() => handleSubmit()}
        disabled={isSubmitting}
        isLoading={isSubmitting}
      />
    </View>
  );
};

export default RegisterForm;
