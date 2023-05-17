import { View, ViewProps } from "react-native";
import React from "react";

/**
 * A container component that centers its children and applies some base styling.
 *
 * @param children - The child elements to be rendered inside the container.
 *
 * @returns - A container component with centered children and base styling.
 */
const Container = ({ children, ...props }: ViewProps): JSX.Element => {
  return (
    <View className="items-center justify-center flex-1 px-4 bg-base-150 dark:bg-base-600" {...props}>
      {children}
    </View>
  );
};

export default Container;
