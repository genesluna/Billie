import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useColorScheme } from "react-native";
import { Feather as Icon } from "@expo/vector-icons";

import Home from "../screens/User/Home";
import colors from "../../colors";
import AddTransaction from "../screens/User/AddTransaction";
import Reports from "../screens/User/Reports";
const { Screen, Navigator } = createBottomTabNavigator();

export function UserRoutes() {
  let colorScheme = useColorScheme();

  return (
    <Navigator
      initialRouteName="home"
      screenOptions={{
        headerTitleAlign: "center",
        headerTintColor: colors.content[150],
        headerStyle: { backgroundColor: colors.primary.DEFAULT },
        tabBarInactiveBackgroundColor: colorScheme === "dark" ? colors.base[600] : colors.primary.DEFAULT,
        tabBarActiveBackgroundColor: colorScheme === "dark" ? colors.base[500] : colors.primary.focus,
        tabBarActiveTintColor: colors.content[150],
        tabBarInactiveTintColor: colors.content[150],
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? colors.base[600] : colors.base[150],
          borderTopColor: colors.primary.faded,
        },
        tabBarLabelPosition: "beside-icon",
        tabBarHideOnKeyboard: true,
      }}
      sceneContainerStyle={{
        backgroundColor: colorScheme === "dark" ? colors.base[600] : colors.base[150],
      }}
    >
      <Screen
        name="home"
        component={Home}
        options={{
          title: "Lista",
          headerShown: false,
          tabBarIcon: ({ color, size }) => <Icon name="list" color={color} size={size} />,
        }}
      />
      <Screen
        name="addTransaction"
        component={AddTransaction}
        options={{
          title: "Adicionar",
          headerTitle: "Adicionar transação",
          tabBarIcon: ({ color, size }) => <Icon name="plus" color={color} size={size} />,
          unmountOnBlur: true,
        }}
      />
      <Screen
        name="reports"
        component={Reports}
        options={{
          title: "Resumo",
          tabBarIcon: ({ color, size }) => <Icon name="pie-chart" color={color} size={size} />,
        }}
      />
    </Navigator>
  );
}
