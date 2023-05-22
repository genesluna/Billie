import {
  Animated,
  View,
  useColorScheme,
  ViewProps,
  Pressable,
  PressableProps,
  GestureResponderEvent,
} from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Feather } from "@expo/vector-icons";
import { ComponentProps } from "react";

import { formatDate } from "../utils/transactionsUtils";
import { Transaction } from "../models/Transaction";
import colors from "../../colors";
import Text from "./common/Text";

type TransactionProps = ViewProps & {
  transaction: Transaction;
  index: number;
  onDelete: (event: GestureResponderEvent) => void;
  onEdit: (event: GestureResponderEvent) => void;
};

type ActionsProps = PressableProps & {
  progress: Animated.AnimatedInterpolation<string | number>;
  dragX: Animated.AnimatedInterpolation<string | number>;
};

let row: Array<Swipeable | null> = [];
let prevOpenedRow: Swipeable | null = null;

const TransactionCard = ({ transaction, index, onDelete, onEdit, ...props }: TransactionProps) => {
  let colorScheme = useColorScheme();
  const amountColor = transaction.type === "income" ? "text-content-income" : "text-content-expense";

  const closeRow = (index: number) => {
    if (prevOpenedRow && prevOpenedRow !== row[index]) {
      prevOpenedRow.close();
    }
    prevOpenedRow = row[index];
  };

  function RightActions({ dragX, ...props }: ActionsProps) {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });

    return (
      <Pressable className="items-center justify-center mb-2 bg-base-150 dark:bg-base-600" {...props}>
        <Animated.View className="p-5" style={{ transform: [{ scale: scale }] }}>
          <Feather name="trash" size={32} color={colors.content.expense} />
        </Animated.View>
      </Pressable>
    );
  }

  function LeftActions({ dragX, ...props }: ActionsProps) {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return (
      <Pressable className="items-center justify-center mb-2 bg-base-150 dark:bg-base-600" {...props}>
        <Animated.View className="p-5" style={{ transform: [{ scale: scale }] }}>
          <Feather name="edit" size={32} color={colors.content.income} />
        </Animated.View>
      </Pressable>
    );
  }

  return (
    <Swipeable
      renderRightActions={(progress, dragX) => (
        <RightActions
          progress={progress}
          dragX={dragX}
          onPress={(event) => {
            row[index]?.close();
            onDelete(event);
          }}
        />
      )}
      renderLeftActions={(progress, dragX) => (
        <LeftActions
          progress={progress}
          dragX={dragX}
          onPress={(event) => {
            row[index]?.close();
            onEdit(event);
          }}
        />
      )}
      onSwipeableOpen={() => closeRow(index)}
      ref={(ref) => (row[index] = ref)}
      friction={3}
    >
      <View
        className="flex-row items-center p-3 mx-2 mb-2 rounded-lg shadow-md bg-content-100 dark:bg-base-400 shadow-shadow-light dark:shadow-shadow-dark"
        {...props}
      >
        <View className="w-12 h-12 p-3 rounded-full bg-primary-faded dark:bg-primary-focus/50">
          <Icon
            name={transaction.category.icon as ComponentProps<typeof Icon>["name"]}
            color={colorScheme === "dark" ? colors.content[150] : colors.content[400]}
            size={24}
          />
        </View>
        <View className="flex-1 pl-3 pr-6">
          <Text size="base" numberOfLines={1}>
            {transaction.description}
          </Text>
          <Text size="sm" className="italic text-content-300 dark:text-content-200">
            {transaction.category.name}
          </Text>
        </View>
        <View className="items-center">
          <Text size="base" className={`font-medium ${amountColor}`}>
            {transaction.amount.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </Text>
          <Text size="sm" className="text-content-300 dark:text-content-200">
            {formatDate(transaction.date)}
          </Text>
        </View>
      </View>
    </Swipeable>
  );
};

export default TransactionCard;
