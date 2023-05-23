import { View, useColorScheme, Pressable, PressableProps } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";
import { ComponentProps } from "react";

import { Category } from "../models/Category";
import colors from "../../colors";
import Text from "./common/Text";

type ReportCardProps = PressableProps & {
  category: Category;
};

const ReportCard = ({ category, ...props }: ReportCardProps) => {
  let colorScheme = useColorScheme();
  const amountColor = category.type === "income" ? "text-content-income" : "text-content-expense";

  return (
    <Pressable
      className="flex-row w-full shadow-md fill-none items-center mx-2 mb-2 rounded-lg bg-content-100 dark:bg-base-400 shadow-shadow-light dark:shadow-shadow-dark/50"
      android_ripple={{ borderless: false, color: colors.primary.faded }}
      delayLongPress={100}
      {...props}
    >
      <View className="w-12 h-12 p-3 my-3 ml-3 rounded-full bg-primary-faded dark:bg-primary-focus/50">
        <Icon
          name={category.icon as ComponentProps<typeof Icon>["name"]}
          color={colorScheme === "dark" ? colors.content[150] : colors.content[400]}
          size={24}
        />
      </View>

      <View className="flex-1 pl-3 pr-6">
        <Text size="base" numberOfLines={1}>
          {category.name}
        </Text>
        <Text size="sm" className="text-content-300 dark:text-content-200">
          {category.totalPercentage?.toFixed(2)}%
        </Text>
      </View>

      <Text size="base" className={`font-medium ${amountColor}`}>
        {category.total?.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </Text>

      <View className="w-2 h-full ml-3 rounded-r-lg" style={{ backgroundColor: category.color }} />
    </Pressable>
  );
};

export default ReportCard;
