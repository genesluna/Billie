import { View, ViewProps, GestureResponderEvent } from "react-native";

import { months } from "../utils/transactionsUtils";
import Button from "./common/Button";
import Text from "./common/Text";

type TransactionsMonthSelectorProps = ViewProps & {
  initialDate: Date | undefined;
  currentDate: Date;
  onPreviousMonth: (event: GestureResponderEvent) => Promise<void>;
  onNextMonth: (event: GestureResponderEvent) => Promise<void>;
};

const TransactionsMonthSelector = ({
  initialDate,
  currentDate,
  onNextMonth,
  onPreviousMonth,
  ...props
}: TransactionsMonthSelectorProps) => {
  if (!initialDate) return null;

  return (
    <View className="flex-row items-center justify-between w-full pt-3 pb-5" {...props}>
      {initialDate.getMonth() !== currentDate.getMonth() ? (
        <Button
          icon="arrow-left"
          iconOnly
          className="w-10 h-10 rounded-full bg-primary/50 dark:bg-primary-faded"
          onPress={onPreviousMonth}
        />
      ) : (
        <View className="w-10 h-10" />
      )}
      <Text size="lg" className="font-medium text-center">
        {months[currentDate.getMonth()]} de {currentDate.getFullYear()}
      </Text>
      {currentDate.getMonth() !== new Date().getMonth() ? (
        <Button
          icon="arrow-right"
          iconOnly
          className="w-10 h-10 rounded-full bg-primary/50 dark:bg-primary-faded"
          onPress={onNextMonth}
        />
      ) : (
        <View className="w-10 h-10" />
      )}
    </View>
  );
};

export default TransactionsMonthSelector;