import { View, FlatList, Pressable, ViewProps, useColorScheme } from "react-native";
import { MaterialCommunityIcons as Icon } from "@expo/vector-icons";

import { categories } from "../data/categories";
import { Category } from "../models/Category";
import { ComponentProps } from "react";
import colors from "../../colors";
import Text from "./common/Text";

type CategoriesListProps = ViewProps & {
  category: Category | undefined;
  onCategorySelected: (category: Category) => void;
  onClose: () => void;
};

const CategoriesList = ({ category, onCategorySelected, onClose, ...props }: CategoriesListProps) => {
  let colorScheme = useColorScheme();

  function handleCategorySelection(item: { key: string; name: string; icon: string }): void {
    onCategorySelected({ name: item.name, icon: item.icon });
    onClose();
  }

  return (
    <View className="h-[51vh] w-[65vw] bg-base-50 dark:bg-base-350" {...props}>
      <FlatList
        className="w-full"
        data={categories}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View>
            <Pressable
              className={`flex-row items-center p-4 ${
                category?.name === item.name ? "bg-primary-faded dark:bg-primary-faded" : ""
              }`}
              onPress={() => handleCategorySelection(item)}
            >
              <Icon
                name={item.icon as ComponentProps<typeof Icon>["name"]}
                size={20}
                color={colorScheme === "dark" ? colors.content[150] : colors.content[400]}
              />
              <Text className="ml-3 font-medium" size="base">
                {item.name}
              </Text>
            </Pressable>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="w-full h-[1] bg-content-300 dark:bg-content-200" />}
      />
    </View>
  );
};

export default CategoriesList;
