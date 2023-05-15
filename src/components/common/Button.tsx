import React, { ComponentProps } from "react";
import { ActivityIndicator, Text, TouchableOpacity, TouchableOpacityProps, View, useColorScheme } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

import colors from "../../../colors";

type ButtonProps = TouchableOpacityProps & {
  label?: string;
  type?: "primary" | "secondary" | "accent" | "neutral" | "danger";
  icon?: ComponentProps<typeof Icon>["name"];
  iconOnly?: boolean;
  isLoading?: boolean;
  outline?: boolean;
};

/**
 * Button component to be used in the application.
 *
 * @param label - Button label text
 * @param type - Button type (primary, secondary, accent or neutral)
 * @param icon - Icon to be displayed on the button
 * @param iconOnly - If true, only icon is displayed on the button
 * @param isLoading - If true, a loading spinner is displayed on the button
 * @param outline - If true, the button is displayed with an outline
 *
 * @returns - A TouchableOpacity component with appropriate styles and children
 */
const Button = ({
  label,
  type = "primary",
  icon,
  iconOnly = false,
  isLoading = false,
  outline = false,
  ...props
}: ButtonProps): JSX.Element => {
  let colorScheme = useColorScheme();
  let color: string =
    type === "primary"
      ? "bg-primary dark:bg-primary"
      : type === "secondary"
      ? "bg-secondary dark:bg-secondary"
      : type === "accent"
      ? "bg-accent dark:bg-accent"
      : type === "danger"
      ? "bg-danger-focus dark:bg-danger-focus"
      : "bg-neutral";
  let iconColor: string = colorScheme === "dark" ? colors.content[150] : colors.content[100];
  let labelColor: string = "text-content-100 dark:text-content-150";

  if (outline) {
    color =
      type === "primary"
        ? "border border-primary dark:border-primary"
        : type === "secondary"
        ? "border border-secondary dark:border-secondary"
        : type === "accent"
        ? "border border-accent dark:border-accent"
        : type === "danger"
        ? "border border-danger-focus dark:border-danger-focus"
        : "border border-neutral";
    labelColor =
      type === "primary"
        ? "text-primary dark:text-primary"
        : type === "secondary"
        ? "text-secondary dark:text-secondary"
        : type === "accent"
        ? "text-accent dark:text-accent"
        : type === "danger"
        ? "text-danger dark:text-danger-focus"
        : "text-neutral";
    iconColor = colorScheme === "dark" ? colors[type].focus : colors[type].DEFAULT;
  }

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center h-12 px-4 ${color} ${iconOnly ? "w-12 px-0" : undefined}`}
      activeOpacity={0.7}
      {...props}
    >
      {!isLoading && !!icon && (
        <View className="items-center justify-center h-full">
          <Icon name={icon} size={iconOnly ? 22 : 16} color={iconColor} />
        </View>
      )}
      {isLoading && <ActivityIndicator className="sh-full" size={iconOnly ? 22 : 16} color={iconColor} />}
      {!!label && !iconOnly && (
        <Text
          className={`text-base font-bold tracking-widest uppercase ${
            !!icon || isLoading ? "pl-2" : "px-0"
          } ${labelColor}`}
        >
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;
