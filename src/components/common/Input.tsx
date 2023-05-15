import React, { ComponentProps, forwardRef, useState } from "react";
import { TextInput, View, TextInputProps, ViewProps, TouchableOpacity, useColorScheme } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";
import { styled } from "nativewind";

import colors from "../../../colors";
import Text from "./Text";

export type InputProps = TextInputProps & {
  label?: string;
  icon?: ComponentProps<typeof Icon>["name"];
  readOnly?: boolean;
  error?: string;
  touched?: boolean;
  isPassword?: boolean;
  inputStyle?: ViewProps["style"];
};

/**
 * A customizable input field component with optional label and icon
 *
 * @param label - Label text to be displayed above the input field
 * @param icon - Icon to be displayed at the left side of the input field
 * @param readOnly - Boolean flag to indicate if the input is editable
 * @param touched - Boolean flag to indicate if the input has been interacted with
 * @param error - Error message to be displayed below the input field when there's an error
 * @param isPassword - Boolean flag to indicate if the input field is for password
 * @param inputStyle - Additional styles to be applied to the input field
 *
 * @returns - A React styled Input component with customizable input fields
 */
const Input = forwardRef<TextInput, InputProps>(
  (
    { label, icon, readOnly = false, touched, error, isPassword = false, inputStyle, ...props }: InputProps,
    ref
  ): JSX.Element => {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const validationIconColor = !touched ? colors.content[300] : error ? colors.error.focus : colors.primary.DEFAULT;
    const validationIconColorDark = !touched ? colors.base[300] : error ? colors.error.DEFAULT : colors.primary.DEFAULT;
    const validationBorderColor = !touched
      ? "border-transparent"
      : error
      ? "border-error-focus dark:border-error"
      : "border-transparent";
    const readOnlyColor = readOnly ? "bg-base-150 dark:bg-base-700" : "bg-content-100 dark:bg-base-400";
    let colorScheme = useColorScheme();

    return (
      <View className="flex items-start mb-2" style={inputStyle}>
        {!!label && <Text className="pb-1 pl-1">{label}</Text>}
        <View className={`flex-row items-center h-12 border-b-2 ${validationBorderColor} focus:border-primary`}>
          {!!icon && (
            <View className={`items-center justify-center h-full px-2 mr-1 w-11 ${readOnlyColor}`}>
              <Icon
                name={icon}
                size={16}
                color={colorScheme === "dark" ? validationIconColorDark : validationIconColor}
              />
            </View>
          )}
          <View className={`justify-center flex-1 h-full pl-4 ${readOnlyColor}`}>
            <TextInput
              className="text-content-400 dark:text-content-100"
              editable={!readOnly}
              underlineColorAndroid="transparent"
              placeholderTextColor={colorScheme === "dark" ? colors.content[200] : colors.content[300]}
              secureTextEntry={isPassword && !showPassword}
              ref={ref}
              {...props}
            />
          </View>
          {isPassword && !readOnly && (
            <TouchableOpacity
              className={`items-center justify-center h-full px-4 ${readOnlyColor}`}
              activeOpacity={1}
              onPress={() => {
                setShowPassword(!showPassword);
              }}
            >
              <Icon
                name={showPassword ? "eye-off" : "eye"}
                size={16}
                color={colorScheme === "dark" ? colors.content[200] : colors.content[400]}
              />
            </TouchableOpacity>
          )}
        </View>
        {touched && error ? <Text className="pt-1 pl-3 text-error-focus dark:text-error">{error}</Text> : null}
      </View>
    );
  }
);

export default styled(Input, {
  props: {
    inputStyle: true,
  },
});
